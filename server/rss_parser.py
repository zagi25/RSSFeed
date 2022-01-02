import requests
import re
import datetime
import time
import sys
from time import strptime



class RSSFeed:
    def __init__(self, url):
        self.url = url
        self.title = None

    def get_data(self, url):
        data = list()
        feed = list()
        try:
            r = requests.get(url)
            feed = re.split('<|>', r.text)
            feed = [ e for e in feed if e.strip()]

            item_index = [i for i in range(0, len(feed)) if feed[i] == 'item']

            for i in range(0, len(item_index) - 1):
                b = self.get_items(item_index[i], item_index[i+1], feed)
                data.append(b)

            return data

        except:
            print('Invalid link')
            return []


    def get_all_data(self):
        data = list()
        all_data = list()
        for u in self.url:
            data += self.get_data(u)

        data = sorted(data, key=lambda k: k['published_at'], reverse=True)

        for i in range(0, len(data)):
            article = dict()
            article['id'] = i
            article['data'] = data[i]
            all_data.append(article)

        return all_data


    def return_data(self, start_i):
        data = self.get_all_data()
        if start_i + 20 > len(data):
            return data[start_i:]
        else:
            return data[start_i: start_i + 20]


    def get_items(self, i, i_end, data):
        index = int()
        fres = dict()
        fres['image']=''
        res = list()
        sliced_data = data[i:i_end]
        for i in range(0, len(sliced_data)):
            if 'title' == sliced_data[i]:
                fres['title'] = self.get_title(sliced_data, i)
            elif 'link' == sliced_data[i]:
                fres['link'] = self.get_link(sliced_data, i)
            elif 'description' == sliced_data[i]:
                desc_img = self.get_desc(sliced_data, i)
                if len(desc_img) == 1:
                    fres['desc'] = desc_img[0]
                elif len(desc_img) == 2:
                    fres['desc'] = desc_img[0]
                    fres['image'] = desc_img[1]
            elif 'pubDate' == sliced_data[i]:
                fres['published_at'] = self.get_pub_date(sliced_data, i)
            elif 'src=' in sliced_data[i]:
                if not fres['image']:
                    fres['image'] = self.get_image(sliced_data, i)

        return fres


    def get_title(self, data, index):
        title_section = self.get_section(index, data, '/title')
        temp = re.split('title|/title|\[|\]|CDATA', ' '.join(title_section))
        temp1 = [e.strip() for e in temp if e.strip()]
        title = [e for e in temp1 if e != '!']

        return ''.join(title)


    def get_link(self, data, index):
        link_section = self.get_section(index, data, '/link')
        temp1 = re.split('link|/link',' '.join(link_section))
        temp2 = [e.strip() for e in temp1 if e.strip()]
        link = ''.join(temp2)

        return link


    def get_desc(self, data, index):
        desc_section = self.get_section(index, data, '/description')
        temp_image = list()
        temp_desc = list()
        for section in desc_section:
            if 'src=' in section:
                temp_image.append(section)
            else:
                temp_desc.append(section)

        temp1_desc = re.split('description|/description|\[|\]|CDATA|!', ' '.join(temp_desc))
        temp2_desc = [ e.strip() for e in temp1_desc if e.strip()]
        temp3_desc = ''.join(temp2_desc).split()
        temp4_desc = list()
        for i in temp3_desc:
            if i != 'br' and i !='/' and i != 'p' and i != '/p' and i != 'em' and i != '/em' and i != '/strong' and i != 'strong':
                temp4_desc.append(i)
        desc = ' '.join(temp4_desc)

        if temp_image:
            temp1_image = ''.join(temp_image).split()
            temp2_image = [image.split('=', 1) for image in temp1_image if 'src=' in image]
            image = temp2_image[0][1].replace('"', '')

            return [desc, image]
        else:
            return [desc]


    def get_pub_date(self, data, index):
        pub_section = self.get_section(index, data, '/pubDate')
        temp = re.split('pubDate|/pubDate', ' '.join(pub_section))

        temp1 = [e for e in temp if e.strip()]
        temp1 = temp1[0].strip()
        dt = temp1.split()
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
        temp1 = temp[1].split()
        image = ''.join(temp1[0])

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
