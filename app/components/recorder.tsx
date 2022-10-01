import { createMachine, assign, send as sendTo } from 'xstate';
import { useMachine } from '@xstate/react';
import { inspect } from '@xstate/inspect';

type Props = {
  audioFileName?: string;
};

if (typeof window !== 'undefined') {
  inspect({
    iframe: false,
  });
}

type RecorderContext = {
  microphones: Array<MediaDeviceInfo>;
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

// Visualizer: https://stately.ai/viz/bc717051-f09f-4802-9a99-aee88d478d39
// Machine image url: https://stately.ai/registry/machines/bc717051-f09f-4802-9a99-aee88d478d39.png
const recorderMachine = createMachine<RecorderContext>(
  {
    id: 'voiceRecorder',
    context: {
      microphones: [],
      selectedMicrophone: null,
      recordedAudio: null,
      audioDowdoadUrl: '',
    },
    initial: 'reading_microphones',
    description: 'Let the user select the microphones and record voice',
    states: {
      reading_microphones: {
        invoke: {
          src: 'getAvailableMicrophones',
          id: 'microphoneList',
          onDone: {
            target: 'ready_to_record',
            actions: 'assignMicrophones',
          },
        },
      },
      ready_to_record: {
        on: {
          SELECT_MICROPHONE: {
            target: 'ready_to_record',
            actions: 'selectMicrophone',
          },
          START_RECORDING: 'recording',
        },
      },
      recording: {
        id: 'currentMediaRecorder',
        invoke: {
          src: 'startRecording',
          id: 'mediaRecorder',
        },
        initial: 'started',
        states: {
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
              RESTART: '#voiceRecorder.recording',
              RECORD_COMPLETE: {
                target: 'stopped',
                actions: 'updateRecording',
              },
            },
          },
        },
      },
    },
    on: {
      SELECT_MICROPHONE: {
        target: 'ready_to_record',
        actions: 'selectMicrophone',
      },
    },
  },
  {
    actions: {
      assignMicrophones: assign({
        microphones: (_, event) => event.data,
        selectedMicrophone: (_, event) => event.data?.[0],
      }),
      selectMicrophone: assign({
        selectedMicrophone: (_, event) => event.microphone,
      }),
      updateRecording: assign({
        recordedAudio: (_, event) => event.recordedAudio,
        audioDowdoadUrl: (_, event) => event.audioDowdoadUrl,
      }),
    },
    services: {
      getAvailableMicrophones: async function getAllMicroPhobes() {
        const allDevices = await navigator.mediaDevices.enumerateDevices();

        return allDevices.filter((device) => device.kind === 'audioinput');
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
          const mediaStream = await navigator.mediaDevices.getUserMedia({
            audio,
            video: false,
          });
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
  const [state, send] = useMachine(recorderMachine, { devTools: true });
  const { context } = state;

  return (
    <>
      <details className="hidden sm:block p-4 shadow-2xl rounded-lg dark:bg-gray-800 open:dark:shadow-glowing">
        <summary>Want to record and download in your voice?</summary>

        {context.microphones.length ? (
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
            {state.matches('recording') &&
            !state.matches('recording.stopped') ? (
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
      </details>
    </>
  );
}
