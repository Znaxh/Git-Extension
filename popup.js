document.addEventListener('DOMContentLoaded', function () {
  const token = 'Your Github Personal Acess token'; 
  const username = 'Github Username'; 
  const repoNames = ['Repo1', 'Repo2', 'Repo3'];

  const updateReadme = (repoName, inputId, buttonId) => {
    document.getElementById(buttonId).addEventListener('click', () => {
      const textToAdd = document.getElementById(inputId).value;

      if (textToAdd) {
        fetch(`https://api.github.com/repos/${username}/${repoName}/contents/README.md`, {
          headers: {
            'Authorization': `token ${token}`
          }
        })
        .then(response => response.json())
        .then(file => {
          const content = atob(file.content); 
          const newContent = content + '\n' + textToAdd;
          const encodedContent = btoa(newContent);

          fetch(`https://api.github.com/repos/${username}/${repoName}/contents/README.md`, {
            method: 'PUT',
            headers: {
              'Authorization': `token ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              message: 'Updated README.md',
              content: encodedContent,
              sha: file.sha 
            })
          })
          .then(response => response.json())
          .then(data => {
            if (data.content) {
              alert(`README.md updated successfully in ${repoName}!`);
            } else {
              alert('Error updating README.md: ' + (data.message || 'Unknown error'));
            }
          })
          .catch(error => {
            console.error('Error updating README.md', error);
          });
        })
        .catch(error => {
          console.error('Error fetching README.md', error);
        });
      } else {
        alert('Please enter the text to add.');
      }
    });
  };

  repoNames.forEach((repoName, index) => {
    const inputId = `readmeUpdateInput${index + 1}`;
    const buttonId = `updateReadmeButton${index + 1}`;
    updateReadme(repoName, inputId, buttonId);
  });
});
