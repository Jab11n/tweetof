<img width="1125" height="375" alt="tweetof banner" src="https://github.com/user-attachments/assets/bbf99d50-4410-4745-bcaa-17cc78995482" />  

# Tweetof 
*Wasteof if it were Twitter in 2015*  
Tweetof is a custom [wasteof.money](https://wasteof.money) client designed to look like Twitter circa 2015. It is a basic Flask application with the goal to offer most wasteof features (aside from account settings, use wasteof.money for that) and some extra quality-of-life improvements such as better embeds for links on Discord and Twitter. It is accessible at [tweetof.jab11n.tech](https://tweetof.jab11n.tech).

## Local Development
If you want to test the project and make changes locally, it's super easy. Ensure you have Python 3 installed, then install the dependencies with pip:
```
pip install flask requests beautifulsoup4
```
After that, you can run the Flask server:
```
flask run --port 8000 --debug
```
> [!NOTE]
> Use port 8000, 8001, 3000, or 5173 when testing locally because those ports on localhost are whitelisted by the wasteof.money API. When visiting in your browser, you must visit `localhost` as `127.0.0.1` and similar are not whitelisted in the wasteof.money API.

