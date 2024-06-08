import torch
import numpy as np
from transformers import WhisperProcessor, WhisperForConditionalGeneration
from pydub import AudioSegment
import sys

def transcribe_audio(file_path):
    try:
        # Load the pre-trained model and processor
        processor = WhisperProcessor.from_pretrained("openai/whisper-base")
        model = WhisperForConditionalGeneration.from_pretrained("openai/whisper-base")

        # Load and convert audio file
        audio = AudioSegment.from_file(file_path)
        audio = audio.set_frame_rate(16000).set_channels(1)
        wav_path = file_path.replace('.m4a', '.wav')
        audio.export(wav_path, format="wav")

        # Convert audio to numpy array
        audio = AudioSegment.from_wav(wav_path)
        audio_np = np.array(audio.get_array_of_samples())

        # Tokenize and get the input features
        input_features = processor(audio_np, sampling_rate=16000, return_tensors="pt").input_features

        # Generate the transcription
        predicted_ids = model.generate(input_features)
        transcription = processor.batch_decode(predicted_ids, skip_special_tokens=True)[0]

        return transcription
    except Exception as e:
        print(f"Error transcribing audio: {e}")
        return None

if __name__ == "__main__":
    file_path = sys.argv[1]
    transcription = transcribe_audio(file_path)
    if transcription:
        print(transcription)
    else:
        print("Transcription failed")
