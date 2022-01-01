#!/usr/bin/env python3
from rss_parser import RSSFeed

# URL = ['https://www.blic.rs/rss/danasnje-vesti','https://www.kurir.rs/rss']
# URL = ['https://www.blic.rs/rss/danasnje-vesti']
# URL = ['https://informer.rs/rss/danasnje-vesti']
# URL = 'https://informer.rs/rss/danasnje-vesti'

# URL = ['https://rss.nytimes.com/services/xml/rss/nyt/World.xml']
# URL = ['https://www.blick.ch/news/rss.xml']
URL = ['https://www.kurir.rs/rss']

def main():
    feed = RSSFeed(URL)
    a = feed.get_all_data()
    # print(a)

if __name__ == '__main__':
    main()

