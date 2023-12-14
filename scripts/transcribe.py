import sys
from openai import OpenAI
from pathlib import Path
import json

client = OpenAI()

def transcribe(audio_path):
    audio_file= open(audio_path, "rb")
    transcript = client.audio.transcriptions.create(
        model="whisper-1",
        file=audio_file,
        response_format="text"
    )
    return (transcript)

def TextToSpeech(audio_path, text):
    speech_file_path = audio_path + "-reply-speech.mp3"
    response = client.audio.speech.create(
        model="tts-1",
        voice="alloy",
        input=text
    )
    response.stream_to_file(speech_file_path)
    return (speech_file_path)

def enregistrer_processus(id, process_info):
    try:
        with open('process_map.json', 'r+') as file:
            data = json.load(file)
            data[id] = {"threadId" : process_info, "threadContent" :[], "threadText": ""}
            file.seek(0)
            json.dump(data, file)
    except FileNotFoundError:
        with open('process_map.json', 'w') as file:
            json.dump({id: {"threadId" : process_info, "threadContent" :[], "threadText": ""}}, file)

def enregistrer_Reponse(id, user, assistant):
    try:
        with open('process_map.json', 'r+') as file:
            data = json.load(file)
            data[id]["threadText"] = data[id]["threadText"] + "user:\n" + user + "\nassistant:\n" + assistant + "\n"
            file.seek(0)
            json.dump(data, file)
    except FileNotFoundError:
        with open('process_map.json', 'w') as file:
            json.dump({id: {"threadId" : process_info, "threadContent" :[], "threadText": "user:\n" + user + "\nassistant:\n" + assistant}}, file)


def obtenir_processus(id):
    try:
        with open('process_map.json', 'r') as file:
            data = json.load(file)
            if id in data:
                return data[id].get('threadId', None)  # Retourne None si 'process_info' n'existe pas
            else:
                return None
    except FileNotFoundError:
        return None

if __name__ == "__main__":
    audio_path = sys.argv[2]
    idUser = sys.argv[1]
    
    transcribe = transcribe(audio_path)
    threadID = obtenir_processus(idUser)
    if threadID == None:
        enregistrer_processus(idUser, thread.id)
    enregistrer_Reponse(idUser, transcribe, "It worked again")
    file = TextToSpeech(audio_path, "It worked again")
    print (file)
