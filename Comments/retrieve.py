from google.oauth2 import service_account
from googleapiclient.discovery import build

API_KEY = "API_KEY"
VIDEO_ID = "VIDEO_ID"

credentials = service_account.Credentials.from_service_account_file(
    'PATH_TO_YOUR_SERVICE_ACCOUNT_FILE')

#API client
youtube = build('youtube', 'v3', credentials=credentials)


comment_count = youtube.commentThreads().list(
    part='snippet',
    videoId=VIDEO_ID,
    textFormat='plainText',
).execute()['pageInfo']['totalResults']

#get top 20% of comments
max_results = int(comment_count * 0.2)
comments = youtube.commentThreads().list(
    part='snippet',
    videoId=VIDEO_ID,
    textFormat='plainText',
    order='votes',
    maxResults=max_results,
).execute()

#print comments
for comment in comments['items']:
    text = comment['snippet']['topLevelComment']['snippet']['textDisplay']
    upvotes = comment['snippet']['topLevelComment']['snippet']['likeCount']
    print(f"{text} ({upvotes} upvotes)")
