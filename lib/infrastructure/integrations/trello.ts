export async function syncToTrello(
  apiKey: string,
  token: string,
  boardId: string,
  data: any[]
) {
  const listName = 'Q&A Database';
  
  // Create a list for Q&As if it doesn't exist
  const lists = await fetch(
    `https://api.trello.com/1/boards/${boardId}/lists?key=${apiKey}&token=${token}`
  ).then(res => res.json());
  
  let listId = lists.find((l: any) => l.name === listName)?.id;
  
  if (!listId) {
    const newList = await fetch(
      `https://api.trello.com/1/lists?name=${listName}&idBoard=${boardId}&key=${apiKey}&token=${token}`,
      { method: 'POST' }
    ).then(res => res.json());
    listId = newList.id;
  }

  // Create cards for each Q&A
  for (const qa of data) {
    await fetch(
      `https://api.trello.com/1/cards?idList=${listId}&key=${apiKey}&token=${token}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: qa.question,
          desc: `Answer: ${qa.answer}\n\nCategory: ${qa.metadata.category || 'Uncategorized'}\nTags: ${qa.tags.join(', ')}\nConfidence: ${qa.confidence}%`,
          pos: 'bottom'
        })
      }
    );
    
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}