const videoId = window.location.search.match(/v=([^&]+)/)[1];

const commentsSection = document.querySelector('#comments');

const observer = new MutationObserver(function(mutations) {
  for (const mutation of mutations) {
    if (mutation.target.id === 'contents') {
      const comments = Array.from(document.querySelectorAll('#contents #comment'));

      comments.sort((a, b) => {
        const aLikes = Number(a.querySelector('#vote-count-middle').innerText);
        const bLikes = Number(b.querySelector('#vote-count-middle').innerText);
        return bLikes - aLikes;
      });

      const numCommentsToShow = Math.ceil(comments.length * 0.2); //top 20% of upvoted youtube comments
      const topComments = comments.slice(0, numCommentsToShow);
      for (const comment of topComments) {
        commentsSection.appendChild(comment);
      }
    }
  }
});

observer.observe(commentsSection, { childList: true });

fetch(`https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&key=YOUR_API_KEY`) //using the Youtube API (see documentation at: https://developers.google.com/youtube/v3)
  .then(response => response.json())
  .then(data => {
    const comments = data.items.map(item => item.snippet.topLevelComment.snippet);
    for (const comment of comments) {
      const commentElement = document.createElement('div');
      commentElement.id = 'comment';
      commentElement.style.padding = '16px';
      commentElement.style.marginBottom = '16px';
      commentElement.style.borderRadius = '3px';
      commentElement.style.backgroundColor = '#f9f9f9';
      commentElement.style.border = '1px solid #ddd';

      const textElement = document.createElement('p');
      textElement.innerText = comment.textDisplay;
      textElement.style.marginBottom = '8px';
      commentElement.appendChild(textElement);

      const authorElement = document.createElement('p');
      authorElement.innerText = `Posted by ${comment.authorDisplayName}`; //person who wrote comment
     
