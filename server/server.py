#!/usr/bin/env python3
import websockets
import asyncio
import json
import sys
from rss_parser import RSSFeed

PORT = 5000
# URL = ['https://rss.nytimes.com/services/xml/rss/nyt/World.xml']
URL = ['https://www.blic.rs/rss/danasnje-vesti', 'https://informer.rs/rss/danasnje-vesti', 'https://www.kurir.rs/rss']
# URL = ['https://informer.rs/rss/danasnje-vesti']

print('Server listening on PORT: ' + str(PORT))

conected = set()

async def start(websocket, path):
    print('A client just connected')
    # async for message in websocket:
    conected.add(websocket)
    feed = RSSFeed(URL)
    async for message in websocket:
        print(message)
        if message == 'get_feed':
            msg = feed.return_data(0)
            data = [{'code':'feed'}, msg]
            response = json.dumps(data)
            await websocket.send(response.encode())
            task = asyncio.create_task(check_new(websocket, feed, msg[0]))


async def check_new(websocket, feed, last):
    while True:
        await asyncio.sleep(0.5)
        newest_msg = feed.return_data(0)
        if newest_msg[0]['published_at'] != last['published_at']:
            data = [{'code':'new_msg'}, newest_msg[0]]
            response = json.dumps(data)
            last = newest_msg[0]
            await  websocket.send(response.encode())


start_server = websockets.serve(start, '127.0.0.1', PORT)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
