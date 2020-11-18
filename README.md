[![Amplience Dynamic Content](header.png)](https://amplience.com/dynamic-content)

# dc-extension-hierarchy-chooser

> Selection of Content Links and Content References from a hierarchy tree.

## dev

```bash
$ npm run serve
```

## build

```bash
$ npm run build
```

## Register the extension

hosted version https://dev-dc-extension-hierarchy-chooser.dev.adis.ws

- Name your extension
- Add your extension url or use our hosted version
- Add Permissionhosted versions
    - Read access
    - Allow Same Origin

### Here is a snippet so you can add your extension easily

```json
{
    "title": "title",
    "type": "array",
    "ui:extension": {
        "name": "<your name of extension here>",
        "params": {
            "nodeId": ""
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
                        "enum": [
                            "https://example.schema.com"
                        ]
                    }
                }
            }
        ]
    }
}
```
## Content Type Schema

Here is a basic schema just including the your node id, content types you wish to select and the name of your extension.

```json
{
	"$schema": "http://json-schema.org/draft-07/schema#",
	"$id": "<schema name here>",
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
				"name": "<your name of extension here>",
				"params": {
					"nodeId": "<node id here>"
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
								"enum": [
									"https://example.schema.com"
								]
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