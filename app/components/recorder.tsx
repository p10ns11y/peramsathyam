import { createMachine, assign, send as sendTo } from 'xstate';
import { useMachine } from '@xstate/react';
import { inspect } from '@xstate/inspect';

type Props = {
  audioFileName?: string;
};

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  inspect({
    iframe: false,
  });
}

type RecorderContext = {
  microphones: Array<MediaDeviceInfo>;
  microphonePermission: 'granted' | 'prompt' | 'denied' | 'unknown';
  selectedMicrophone: MediaDeviceInfo | null;
  recordedAudio: Blob | null;
  audioDowdoadUrl: string;
};

function stopMediaRecorder(mediaRecorder: MediaRecorder) {
  if (mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
  }

  for (const track of mediaRecorder.stream.getAudioTracks()) {
    if (track.enabled) {
      track.stop();
    }
  }
  mediaRecorder.ondataavailable = null;
}

const initialContextValue: RecorderContext = {
  microphones: [],
  microphonePermission: 'unknown',
  selectedMicrophone: null,
  recordedAudio: null,
  audioDowdoadUrl: '',
};

// Visualizer: https://stately.ai/viz/bc717051-f09f-4802-9a99-aee88d478d39
// Machine image url: https://stately.ai/registry/machines/bc717051-f09f-4802-9a99-aee88d478d39.png
const recorderMachine = createMachine<RecorderContext>(
  {
    context: initialContextValue,
    predictableActionArguments: true,
    id: 'voiceRecorder',
    initial: 'reading_microphones',
    description: 'Let the user select the microphones and record voice',
    states: {
      reading_microphones: {
        invoke: {
          src: 'getAvailableMicrophones', // get the default microphone
          id: 'microphoneList',
          onDone: [
            {
              target: 'ready_to_record',
              actions: 'assignMicrophones',
            },
          ],
          onError: [
            {
              target: 'no_microphone_access',
            },
          ],
        },
      },
      ready_to_record: {
        on: {
          SELECT_MICROPHONE: {
            target: 'ready_to_record',
            actions: 'selectMicrophone',
            internal: false,
          },
          START_RECORDING: {
            target: 'recording',
          },
          LOAD_ALL_MICROPHONES: {
            target: 'loading_all_microphones',
          },
        },
      },
      no_microphone_access: {
        entry: 'resetUponMicrophoneAccessDenied',
      },
      loading_all_microphones: {
        invoke: {
          src: 'invokeMicrophoneConsent',
          id: 'microphoneConsent',
          onDone: [
            {
              target: 'reading_microphones',
              actions: 'updateMicrophoneConsent',
            },
          ],
          onError: [
            {
              target: 'no_microphone_access',
            },
          ],
        },
      },
      recording: {
        invoke: {
          src: 'startRecording',
          id: 'mediaRecorder',
        },
        initial: 'prompt',
        states: {
          prompt: {
            // TODO: Add Eventless ("Always") Transition to started if already permission granded
            // https://xstate.js.org/docs/guides/transitions.html#transient-transitions
            on: {
              START: {
                target: 'started',
              },
              MICROPHONE_CONSENT_DENIED: {
                target: '#voiceRecorder.no_microphone_access',
              },
              MICROPHONE_CONSENT_GIVEN: {
                target: 'started',
                actions: 'updateMicrophoneConsent',
              },
            },
          },
          started: {
            on: {
              STOP: {
                target: 'stopped',
                actions: sendTo('stop', { to: 'mediaRecorder' }),
              },
            },
          },
          stopped: {
            on: {
              RESTART: {
                target: '#voiceRecorder.recording',
              },
              RECORD_COMPLETE: {
                target: 'stopped',
                actions: 'updateRecording',
                internal: false,
              },
            },
          },
        },
      },
    },
  },
  {
    actions: {
      assignMicrophones: assign({
        microphones: (_, event) => event.data.audioInputDevices,
        selectedMicrophone: (_, event) => event.data.audioInputDevices?.[0],
        microphonePermission: (_, event) => event.data.permission,
      }),
      selectMicrophone: assign({
        selectedMicrophone: (_, event) => event.microphone,
      }),
      updateRecording: assign({
        recordedAudio: (_, event) => event.recordedAudio,
        audioDowdoadUrl: (_, event) => event.audioDowdoadUrl,
      }),
      // either the service invokeMicrophoneConsent call this or user consent action
      // in startRecording call this
      updateMicrophoneConsent: assign({
        microphonePermission: (_, event) =>
          event.data?.consent || event.consent,
      }),
      // https://xstate.js.org/docs/guides/typescript.html#troubleshooting
      // Using unused context here to make typecript happy and it will be fixed
      // In v5. TODO: Remove once upgraded t0 v5
      resetUponMicrophoneAccessDenied: assign((context) => ({
        ...initialContextValue,
        microphonePermission: 'denied',
      })),
    },
    services: {
      getAvailableMicrophones: async function getAllMicroPhobes() {
        const microphonePermission = await navigator.permissions.query({
          name: 'microphone',
        });

        if (microphonePermission.state === 'denied') {
          throw new Error('Microphone permission is denied');
        }

        const allDevices = await navigator.mediaDevices.enumerateDevices();
        const audioInputDevices = allDevices.filter(
          (device) => device.kind === 'audioinput'
        );

        return { audioInputDevices, permission: microphonePermission.state };
      },
      invokeMicrophoneConsent: async function invokeMicrophoneConsent() {
        try {
          // const allDevices = await navigator.mediaDevices.enumerateDevices();
          // const audioInputDevices = allDevices.filter(
          //   (device) => device.kind === 'audioinput'
          // );
          await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: false,
          });

          return { consent: 'granted' };
        } catch (error) {
          throw error;
        }
      },
      startRecording: (context) => (sendBack, onReceive) => {
        let mediaRecorder: MediaRecorder;

        const recordedChunks: Array<BlobPart> = [];

        function handleMediaDataAvailable(e: BlobEvent) {
          if (e.data.size > 0) {
            recordedChunks.push(e.data);
          }
        }

        function completeRecodring() {
          const recordedContent = new Blob(recordedChunks);
          const recordedContentUrl = URL.createObjectURL(recordedContent);
          sendBack({
            // #voiceRecorder.recording.#currentMediaRecorder.
            type: 'RECORD_COMPLETE',
            recordedAudio: recordedContent,
            audioDowdoadUrl: recordedContentUrl,
          });
          stopMediaRecorder(mediaRecorder);
        }

        async function startVoiceRecording() {
          const deviceId = context.selectedMicrophone?.deviceId;
          const audio = deviceId ? { deviceId: { exact: deviceId } } : true;
          let mediaStream;
          try {
            mediaStream = await navigator.mediaDevices.getUserMedia({
              audio,
              video: false,
            });
            console.log('MICROPHONE_CONSENT_GIVEN');
            sendBack({
              type: 'MICROPHONE_CONSENT_GIVEN',
              consent: 'granted',
            });
          } catch (error) {
            sendBack({
              type: 'MICROPHONE_CONSENT_DENIED',
            });
            return;
          }

          mediaRecorder = new MediaRecorder(mediaStream, {
            mimeType: 'audio/webm',
          });

          mediaRecorder.addEventListener(
            'dataavailable',
            handleMediaDataAvailable
          );

          mediaRecorder.addEventListener('stop', completeRecodring);

          mediaRecorder.start();

          onReceive((event) => {
            if (event.type === 'pause') {
              mediaRecorder.pause();
            } else if (event.type === 'resume') {
              mediaRecorder.resume();
            } else if (event.type === 'stop') {
              mediaRecorder.stop();
            }
          });
        }

        startVoiceRecording();

        return () => {
          mediaRecorder?.removeEventListener(
            'dataavailable',
            handleMediaDataAvailable
          );
          mediaRecorder?.removeEventListener('stop', completeRecodring);
        };
      },
    },
  }
);

export default function Recorder(props: Props) {
  const { audioFileName } = props;
  const [state, send] = useMachine(recorderMachine, {
    devTools: process.env.NODE_ENV === 'development',
  });
  const { context } = state;

  const renderRecorder = () => {
    if (
      state.matches('no_microphone_access') ||
      context.microphonePermission === 'denied' // may be redundant check
    ) {
      return <div>Microphone access is denied</div>;
    }

    return (
      <div className="flex flex-col gap-4">
        <div className="py-2 flex items-center gap-4">
          {state.matches('ready_to_record') ? (
            <button
              className="p-2 text-white rounded-full bg-pink-700 hover:bg-pink-500"
              onClick={() => send({ type: 'START_RECORDING' })}
            >
              Record
            </button>
          ) : null}
          {state.matches('recording') && state.matches('recording.prompt') ? (
            <span>Waiting user consent for microphone...</span>
          ) : null}

          {state.matches('recording') && state.matches('recording.started') ? (
            <>
              <button
                className="p-2 text-white rounded-full bg-pink-700 hover:bg-pink-500"
                onClick={() => send({ type: 'STOP' })}
              >
                Stop
              </button>
              <span>Recording...</span>
            </>
          ) : null}
          {state.matches('recording.stopped') ? (
            <>
              <a
                role="button"
                className="inline-block text-white p-2 rounded-full bg-pink-700 hover:bg-pink-500"
                href={context.audioDowdoadUrl}
                download={`${audioFileName}.webm` || 'recorded.webm'}
              >
                Download
              </a>
              <button
                className="p-2 text-white rounded-full bg-pink-700 hover:bg-pink-500"
                onClick={() => send({ type: 'RESTART' })}
              >
                Re-record
              </button>
            </>
          ) : null}
        </div>
        <div>
          {state.matches('recording.stopped') ? (
            <audio
              className="w-[250px]"
              controls
              src={context.audioDowdoadUrl}
            />
          ) : null}
        </div>
      </div>
    );
  };

  return (
    <>
      <details className="hidden sm:block p-4 shadow-2xl rounded-lg dark:bg-gray-800 open:dark:shadow-glowing">
        <summary>Want to record and download in your voice?</summary>

        {context.microphonePermission === 'granted' &&
        context.selectedMicrophone?.deviceId ? (
          <select
            name="microphones"
            className="p-4 text-black dark:text-white dark:bg-gray-600 border-rose-700 rounded-lg"
            value={context.selectedMicrophone?.deviceId}
            onChange={(e) =>
              send({ type: 'SELECT_MICROPHONE', microphone: e.target.value })
            }
          >
            {context.microphones.map((microphone) => (
              <option key={microphone.deviceId} value={microphone.deviceId}>
                {microphone.label}
              </option>
            ))}
          </select>
        ) : null}
        {context.microphonePermission === 'prompt' ? (
          <button
            className="p-2 text-white rounded-full bg-pink-700 hover:bg-pink-500"
            onClick={() => send({ type: 'LOAD_ALL_MICROPHONES' })}
          >
            Load All Microphones
          </button>
        ) : null}
        {renderRecorder()}
      </details>
    </>
  );
}
