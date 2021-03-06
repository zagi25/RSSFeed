#!/usr/bin/env python3
import websockets
import os
import asyncio
import json
import sys
from rss_parser import RSSFeed

# PORT = 5000
SERVER_URL = '0.0.0.0'

# HOST = socket.gethostbyname(socket.gethostname())
PORT = int(os.environ.get("PORT", 5000))

print('Server listening on PORT: ' + str(PORT))

connected = set()

def disconn():
    print('User disconnected!')
    print('Users connected: ' + str(len(connected)))

async def start(websocket, path):
    print('A client just connected')
    connected.add(websocket)
    print(websocket.remote_address)
    print('Users connected: ' + str(len(connected)))
    msg = list()
    try:
        async for message in websocket:
            recived_message = json.loads(message)
            if recived_message['code'] == 'get_feed':
                url = list()
                for key,value in recived_message['data'].items():
                    url.append(value)
                feed = RSSFeed(url)
                msg = feed.get_all_data()
                data = [{'code':'feed'}, msg[:20]]
                response = json.dumps(data)
                await websocket.send(response.encode())
                task_new_msg = asyncio.create_task(check_new(websocket, feed, msg[0]))
                task_check_connection = asyncio.create_task(check_connection(websocket))
            elif recived_message['code'] == 'get_more_feed':
                data = [{'code':'more_feed'}, msg[recived_message['data']:recived_message['data'] + 20]]
                response = json.dumps(data)
                await websocket.send(response.encode())
    except websockets.exceptions.ConnectionClosedOK:
        connected.remove(websocket)
        disconn()
    except websockets.exceptions.ConnectionClosedError:
        connected.remove(websocket)
        disconn()

async def check_new(websocket, feed, last):
    while True:
        await asyncio.sleep(5)
        newest_msg = feed.return_data(0)
        if newest_msg[0]['data']['published_at'] != last['data']['published_at']:
            data = [{'code':'new_msg'}, newest_msg[0]]
            response = json.dumps(data)
            last = newest_msg[0]
            if websocket in connected:
                try:
                    await  websocket.send(response.encode())
                except websockets.exceptions.ConnectionClosedOK:
                    connected.remove(websocket)
                    disconn()
                    break
                except websockets.exceptions.ConnectionClosedError:
                    connected.remove(websocket)
                    disconn()
                    break
            else:
                break

async def check_connection(websocket):
    while True:
        await asyncio.sleep(5)
        if websocket in connected:
            try:
                data = [{'code':'check_conn'}, 'alive']
                response = json.dumps(data)
                await websocket.send(response.encode())
            except websockets.exceptions.ConnectionClosedOK:
                connected.remove(websocket)
                disconn()
                break
            except websockets.exceptions.ConnectionClosedError:
                connected.remove(websocket)
                disconn()
                break
        else:
            break

start_server = websockets.serve(start, SERVER_URL , PORT)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
