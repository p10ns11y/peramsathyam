import React from 'react';

let mediaRecorder: MediaRecorder;

enum RecordState {
  Idle = 'idle',
  Recording = 'recording',
  Recorded = 'recorded',
}

type Props = {
  audioFileName?: string;
};

export default function Record(props: Props) {
  const { audioFileName } = props;
  const [recordState, setRecordState] = React.useState<string>(
    RecordState.Idle
  );
  const playerRef = React.useRef<HTMLAudioElement | null>(null);
  const downloadRef = React.useRef<HTMLAnchorElement | null>(null);

  async function startRecording() {
    setRecordState(RecordState.Recording);

    const recordedChunks: Array<BlobPart> = [];
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });
    mediaRecorder = new MediaRecorder(mediaStream, { mimeType: 'audio/webm' });

    mediaRecorder.addEventListener('dataavailable', function (e) {
      if (e.data.size > 0) recordedChunks.push(e.data);
    });

    mediaRecorder.addEventListener('stop', function () {
      if (!downloadRef.current) {
        return;
      }

      const recordedContent = URL.createObjectURL(new Blob(recordedChunks));

      downloadRef.current.href = recordedContent;
      downloadRef.current.download = `${audioFileName}.webm` || 'recorded.webm';

      if (!playerRef.current) {
        return;
      }

      playerRef.current.src = recordedContent;
    });

    mediaRecorder.start();
  }

  function stopRecording() {
    if (mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }

    for (const track of mediaRecorder.stream.getAudioTracks()) {
      if (track.enabled) track.stop();
    }

    mediaRecorder.ondataavailable = null;
    setRecordState(RecordState.Recorded);
  }

  return (
    <details className="hidden sm:block p-4 shadow-2xl rounded-lg dark:bg-gray-800 open:dark:shadow-glowing">
      <summary>Want to record and download in your voice?</summary>

      <div className="flex flex-col gap-4">
        <div className="py-2 flex items-center gap-4">
          {recordState === RecordState.Idle ||
          recordState === RecordState.Recorded ? (
            <button
              className="p-2 text-white rounded-full bg-pink-700 hover:bg-pink-500"
              onClick={startRecording}
            >
              {recordState === RecordState.Recorded ? 'Re-record' : 'Record'}
            </button>
          ) : null}
          {recordState === RecordState.Recording ? (
            <>
              <button
                className="p-2 text-white rounded-full bg-pink-700 hover:bg-pink-500"
                onClick={stopRecording}
              >
                Stop
              </button>
              <span>Recording...</span>
            </>
          ) : null}
          {recordState === RecordState.Recorded ? (
            // eslint-disable-next-line jsx-a11y/anchor-is-valid
            <a
              role="button"
              className="inline-block text-white p-2 rounded-full bg-pink-700 hover:bg-pink-500"
              ref={downloadRef}
            >
              Download
            </a>
          ) : null}
        </div>
        <div>
          {recordState === RecordState.Recorded ? (
            <audio className="w-[250px]" controls ref={playerRef} />
          ) : null}
        </div>
      </div>
    </details>
  );
}
