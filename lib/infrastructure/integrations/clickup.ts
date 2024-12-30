export async function syncToClickUp(
  apiKey: string,
  listId: string,
  data: any[]
) {
  for (const qa of data) {
    await fetch(`https://api.clickup.com/api/v2/list/${listId}/task`, {
      method: 'POST',
      headers: {
        'Authorization': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: qa.question,
        description: qa.answer,
        tags: qa.tags,
        custom_fields: [
          {
            name: 'Category',
            value: qa.metadata.category || 'Uncategorized'
          },
          {
            name: 'Confidence',
            value: qa.confidence
          }
        ]
      })
    });

    await new Promise(resolve => setTimeout(resolve, 200));
  }
}