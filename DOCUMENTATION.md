
# instalaciones

Extension: PlantUML

https://marketplace.visualstudio.com/items?itemName=jebbs.plantuml


- PlantUML
- structurizr


# Azure AI search

region: EAST US

```json
{
  "name": "confluence-index",
  "fields": [
    { "name": "id", "type": "Edm.String", "key": true, "filterable": true },

    { "name": "title", "type": "Edm.String", "searchable": true },
    { "name": "content", "type": "Edm.String", "searchable": true },
    { "name": "url", "type": "Edm.String", "filterable": true },
    { "name": "source", "type": "Edm.String", "filterable": true },
    { "name": "chunkId", "type": "Edm.Int32", "filterable": true },

    {
      "name": "contentVector",
      "type": "Collection(Edm.Single)",
      "searchable": true,
      "dimensions": 1536,
      "vectorSearchProfile": "vector-profile"
    }
  ],

  "vectorSearch": {
    "algorithms": [
      {
        "name": "hnsw-algorithm",
        "kind": "hnsw"
      }
    ],
    "profiles": [
      {
        "name": "vector-profile",
        "algorithm": "hnsw-algorithm"
      }
    ]
  },

  "semantic": {
    "configurations": [
      {
        "name": "semantic-config",
        "prioritizedFields": {
          "titleField": { "fieldName": "title" },
          "prioritizedContentFields": [
            { "fieldName": "content" }
          ]
        }
      }
    ]
  }
}
```

```code
"dimensions": 1536, text-embedding-3-small
"dimensions": 3072, text-embedding-3-large
```
