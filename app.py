from flask import Flask, request, jsonify, send_from_directory, render_template
import requests
from bs4 import BeautifulSoup
import re

app = Flask(__name__, static_folder='static', template_folder='templates')

def convertpostcontent(content):
    soup = BeautifulSoup(content, 'html.parser')
    parts = []
    for e in soup.contents:
        if e.name == 'p':
            text = e.get_text(strip=True)
            parts.append(text)
        elif e.name == 'img':
            imgurl = e.get('src')
            parts.append(f"[Click to view image]({imgurl})")
        else:
            parts.append(e.get_text(strip=True))
    converted = '\n\n'.join(parts)
    converted = re.sub(r'@(\w+)', r'[@\1](https://tweetof.jab11n.tech/users/\1)', converted)
    return converted

@app.route('/')
def index():
    return render_template('home-loggedout.html')

@app.route('/users/<username>')
def user_profile(username):
    return render_template('user.html', username=username)

@app.route('/posts/<post_id>')
def post_view(post_id):
    post_info = requests.get(f"https://api.wasteof.money/posts/{post_id}").json()
    post_contents = convertpostcontent(post_info["content"])
    post = {
        'author': post_info["poster"]["name"],
        'content': post_contents[:400] + '...' if len(post_contents) > 400 else post_contents,
        'time': post_info["time"],
        'comments': post_info["comments"],
        'loves': post_info["loves"],
        'reposts': post_info["reposts"]
    }
    c = post_info["poster"]["color"]
    colors = {
        'red': '#ef4444',
        'orange': '#f97316',
        'yellow': '#eab308',
        'green': '#22c55e',
        'teal': '#14b8a6',
        'cyan': '#06b6d4',
        'blue': '#3b82f6',
        'indigo': '#6366f1',
        'violet': '#8b5cf6',
        'purple': '#a855f7',
        'fuchsia': '#d946ef',
        'pink': '#ec4899',
        'gray': '#6b7280'
    }
    color = colors.get(c)
    return render_template('post.html', id=post_id, post=post, color=color)

@app.route('/static/<path:path>')
def serve_static(path):
    return send_from_directory('static', path)

if __name__ == '__main__':
    app.run(debug=True)
