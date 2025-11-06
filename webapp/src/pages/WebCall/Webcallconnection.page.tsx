// import React, { useEffect, useRef, useState } from 'react';
// import { io, Socket } from 'socket.io-client';
// import { CommonHelper } from '../../helper/helper';

// const CHUNK_BATCH_SIZE = 5;

// const WebConnectPage: React.FC = () => {
//   const [transcript, setTranscript] = useState('');
//   const [llmOutput, setLlmOutput] = useState('');
//   const [isRecording, setIsRecording] = useState(false);
//   const [audioLevel, setAudioLevel] = useState(0);
//   const [socketError, setSocketError] = useState<string | null>(null);

//   const audioContextRef = useRef<AudioContext | null>(null);
//   const workletNodeRef = useRef<AudioWorkletNode | null>(null);
//   const chunkQueueRef = useRef<Uint8Array[]>([]);
//   const socketRef = useRef<Socket | null>(null);
//   const helper = CommonHelper;

//   useEffect(() => {
//     helper.Showspinner();

//     const socket = io('http://localhost:8000', {
//       transports: ['websocket', 'polling'],
//       reconnection: true,
//       reconnectionAttempts: 5,
//       reconnectionDelay: 1000,
//     });

//     socketRef.current = socket;

//     socket.on('connect', () => {
//       console.log('✅ Connected to backend');
//       setSocketError(null);
//       helper.Hidespinner();
//     });

//     socket.on('connect_error', (err) => {
//       console.error('❌ Socket connect error:', err);
//       setSocketError('Cannot connect to server. Make sure backend is running.');
//       helper.Hidespinner();
//     });

//     socket.on('disconnect', (reason) => console.warn('⚠️ Socket disconnected:', reason));

//     socket.on('transcription', (data) => setTranscript((prev) => prev + ' ' + data.text));
//     socket.on('llm_chunk', (data) => setLlmOutput((prev) => prev + ' ' + data.text));

//     return () => socket.disconnect();
//   }, []);

//   const mergeChunks = (chunks: Uint8Array[]): Uint8Array => {
//     const totalLength = chunks.reduce((acc, c) => acc + c.length, 0);
//     const merged = new Uint8Array(totalLength);
//     let offset = 0;
//     chunks.forEach((c) => {
//       merged.set(c, offset);
//       offset += c.length;
//     });
//     return merged;
//   };

//   const sendChunkBatch = () => {
//     if (!socketRef.current) return;
//     while (chunkQueueRef.current.length >= CHUNK_BATCH_SIZE) {
//       const batch = chunkQueueRef.current.splice(0, CHUNK_BATCH_SIZE);
//       socketRef.current.emit('audio_chunk', mergeChunks(batch));
//     }
//   };

//   const startRecording = async () => {
//     if (!socketRef.current || socketError) {
//       alert('Cannot record: not connected to server.');
//       return;
//     }

//     const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//     const audioContext = new AudioContext();
//     audioContextRef.current = audioContext;

//     const workletCode = `/* Paste your RecorderProcessor worklet code here */`;
//     const blob = new Blob([workletCode], { type: 'application/javascript' });
//     await audioContext.audioWorklet.addModule(URL.createObjectURL(blob));

//     const workletNode = new AudioWorkletNode(audioContext, 'recorder-processor');
//     workletNode.port.onmessage = (event) => {
//       chunkQueueRef.current.push(new Uint8Array(event.data));
//       setAudioLevel(event.data.byteLength / 1000);
//       sendChunkBatch();
//     };
//     workletNodeRef.current = workletNode;

//     const source = audioContext.createMediaStreamSource(stream);
//     source.connect(workletNode);
//     setIsRecording(true);
//   };lm

//   const stopRecording = () => {
//     workletNodeRef.current?.disconnect();
//     audioContextRef.current?.close();
//     setIsRecording(false);
//     setAudioLevel(0);

//     if (chunkQueueRef.current.length && socketRef.current) {
//       socketRef.current.emit('audio_chunk', mergeChunks(chunkQueueRef.current));
//       chunkQueueRef.current = [];
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
//       <h1 className="text-3xl font-bold mb-8">🎙️ Live STT + LLM</h1>

//       {socketError && <p className="text-red-500 mb-4">{socketError}</p>}

//       <button
//         onClick={isRecording ? stopRecording : startRecording}
//         className={`p-6 rounded-full transition-colors duration-300 ${
//           isRecording ? 'bg-red-500 animate-pulse' : 'bg-blue-500 hover:bg-blue-600'
//         }`}
//       >
//         {isRecording ? 'Stop Recording' : 'Start Recording'}
//       </button>

//       <div className="w-full max-w-md h-4 bg-gray-700 rounded mt-6 overflow-hidden">
//         <div className="h-full bg-green-400 transition-all" style={{ width: `${Math.min(audioLevel, 100)}%` }} />
//       </div>

//       <div className="mt-6 text-left max-w-2xl w-full space-y-4">
//         <p className="text-gray-300"><strong>Transcription:</strong> {transcript || '...'}</p>
//         <p className="text-yellow-300"><strong>LLM Output:</strong> {llmOutput || '...'}</p>
//       </div>
//     </div>
//   );
// };

// export default WebConnectPage;
