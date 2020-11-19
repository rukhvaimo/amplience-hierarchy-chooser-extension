[![Amplience Dynamic Content](header.png)](https://amplience.com/dynamic-content)

# dc-extension-hierarchy-chooser

> Allows selection of Content Links and Content References from a hierarchy tree.

## dev

```bash
$ npm run serve
```

## build

```bash
$ npm run build
```

## Installation parameters

| Parameter | Default   | Notes                                                  | Required |
| --------- | --------- | ------------------------------------------------------ | -------- |
| nodeId    | undefined | The ID of the node to use as the root node of the tree | true     |

## Registering the extension

- Register your extension in Dynamic Content
- Add your custom extension url or use our hosted version: https://dev-dc-extension-hierarchy-chooser.dev.adis.ws
- Give the extension the following permissions:
  - Read access
  - Allow Same Origin

### Example snippet

```json
{
  "title": "title",
  "type": "array",
  "ui:extension": {
    "name": "<extension name>",
    "params": {
      "nodeId": "<root node ID>"
    }
  },
  "items": {
    "allOf": [
      {
        "$ref": "http://bigcontent.io/cms/schema/v1/core#/definitions/content-link"
      },
      {
        "properties": {
          "contentType": {
            "enum": ["https://example.schema.com"]
          }
        }
      }
    ]
  }
}
```

### Sample schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "<schema name>",
  "title": "Title",
  "description": "Description",
  "allOf": [
    {
      "$ref": "http://bigcontent.io/cms/schema/v1/core#/definitions/content"
    }
  ],
  "type": "object",
  "properties": {
    "treeNodes": {
      "title": "title",
      "type": "array",
      "minItems": 2,
      "maxItems": 5,
      "ui:extension": {
        "name": "<extension name>",
        "params": {
          "nodeId": "<root node ID>"
        }
      },
      "items": {
        "allOf": [
          {
            "$ref": "http://bigcontent.io/cms/schema/v1/core#/definitions/content-link"
          },
          {
            "properties": {
              "contentType": {
                "enum": ["https://example.schema.com"]
              }
            }
          }
        ]
      }
    }
  },
  "propertyOrder": []
}
```
