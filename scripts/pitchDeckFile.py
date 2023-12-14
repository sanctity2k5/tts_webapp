import sys
from openai import OpenAI
from pathlib import Path
import json

client = OpenAI()

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
            data[id] = {"threadId" : process_info, "fileId" : "", "threadContent" :[], "threadText": ""}
            file.seek(0)
            json.dump(data, file)
    except FileNotFoundError:
        with open('process_map.json', 'w') as file:
            json.dump({id: {"threadId" : process_info, "fileId" : "", "threadContent" :[], "threadText": ""}}, file)

def enregistrer_Reponse(id, fileId, assistant):
    try:
        with open('process_map.json', 'r+') as file:
            data = json.load(file)
            data[id]["threadText"] = data[id]["threadText"] + "user:\n" + "Bonjour, voici mon pitch deck que je vais vous présenter juste après." + "\nassistant:\n" + assistant + "\n"
            data[id]["fileId"] = fileId
            file.seek(0)
            json.dump(data, file)
    except FileNotFoundError:
        with open('process_map.json', 'w') as file:
            json.dump({id: {"threadId" : process_info, "fileId" : fileId, "threadContent" :[], "threadText": "user:\n" + user + "\nassistant:\n" + assistant}}, file)


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
    deck_path = sys.argv[2]
    idUser = sys.argv[1]

    threadID = obtenir_processus(idUser)
    if threadID == None: #Save the data link to the current user, can use other storage of course
        enregistrer_processus(idUser, thread.id)

    enregistrer_Reponse(idUser, fileId, "IT WORKED!")
    file = TextToSpeech(deck_path, "IT WORKED!") #if you dont have openAI credential, just print file path
    print (file)
