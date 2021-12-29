import requests
import re
import datetime
import time
from time import strptime



class RSSFeed:
    def __init__(self, url):
        self.url = url
        self.title = None

    def get_data(self):
        data = list()
        recived = list()
        feed = list()
        for u in self.url:
            r = requests.get(u)
            lines = r.text.split()
            feed = [l for l in lines]

        item_index = [i for i in range(0, len(feed)) if feed[i] == '<item>']
        for i in range(0, len(item_index) - 1):
            b = self.get_items(item_index[i], item_index[i+1], feed)
            data.append(b)
            data = sorted(data, key=lambda k: k['published_at'], reverse=True)

        return data

    def return_data(self, start_i):
        data = self.get_data()
        if start_i + 20 > len(data):
            return data[start_i:]
        else:
            return data[start_i: start_i + 20]

    def get_items(self, i, i_end, data):
        index = int()
        fres = dict()
        res = list()
        sliced_data = data[i:i_end]
        res.append(sliced_data)
        for i in range(0, len(sliced_data)):
            if '<title>' in sliced_data[i]:
                fres['title'] = self.get_title(sliced_data, i)
            elif '<link>' in sliced_data[i]:
                fres['link'] = self.get_link(sliced_data, i)
            elif '<description>' in sliced_data[i]:
                fres['description'] = self.get_desc(sliced_data, i)
            elif '<pubDate>' in sliced_data[i]:
                fres['published_at'] = self.get_pub_date(sliced_data, i)
            elif 'src=' in sliced_data[i]:
                fres['image'] = self.get_image(sliced_data, i)

        return fres

    def get_title(self, data, index):
        title_section = self.get_section(index, data, '</title>')
        temp = re.split('<title>|</title>|\[|\]|CDATA|<!|>', ' '.join(title_section))
        title = [e for e in temp if e.strip()]

        return title[0]

    def get_link(self, data, index):
        link = list()
        link = re.split('<link>|</link>',data[index])

        return link[1]

    def get_desc(self, data, index):
        desc_section = self.get_section(index, data, '</description>')

        temp = re.split('<description>|</description>|\[|\]|CDATA|<!|>', ' '.join(desc_section))
        desc = [ e for e in temp if e.strip()]
        if desc:
            if '<img src' in desc[0]:
                return None
            else:
                return desc[0]

    def get_pub_date(self, data, index):
        pub_section = self.get_section(index, data, '</pubDate>')

        temp = re.split('<pubDate>|</pubDate>', ' '.join(pub_section))
        temp1 = [e for e in temp if e.strip()]
        dt = temp1[0].split()
        year = dt[3]
        month_str = dt[2]
        month = strptime(month_str, '%b').tm_mon
        day = dt[1]
        time = dt[4].split(':')
        hour = time[0]
        minute = time[1]
        second = time[2]
        date = datetime.datetime(int(year), int(month), int(day), int(hour), int(minute), int(second)).strftime('%s')

        return date

    def get_image(self, data, index):
        temp = data[index].split('=')
        if '>' in temp[1]:
            temp1 = temp[1].split('>')
            image = temp1[0][:-1]
        else:
            image = temp[1]


        return image.replace('"', '')

    def get_section(self, index, data, section_end):
        res = list()
        for i in range(index, len(data)):
            if section_end not in data[i]:
                res.append(data[i])
            else:
                res.append(data[i])
                break

        return res
