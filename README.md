![Tests](https://github.com/Cringe-Studio/strapi-auto-uuid/actions/workflows/main.yml/badge.svg)

# Strapi Auto NanoID Plugin

The Strapi Auto NanoID Plugin is a custom plugin for Strapi that automatically generates a unique NanoID for your content.

## Installation

To install the Strapi Auto NanoID Plugin, simply run one of the following command:

```
pnpm add strapi-auto-nanoid
```
```
npm install strapi-auto-nanoid
```
```
yarn add strapi-auto-nanoid
```

## Usage

Once the plugin is installed, you can add a new custom type to your Strapi content types, no configuration needed. The custom type uses the Strapi UID structure, ensuring that each NanoID generated is unique.

You can create new records via the Admin panel, API or GraphQL, and the plugin will automatically generate a NanoID for each new record created.

## Example

Here's an example of how to use the Strapi Auto NanoID Plugin:

1. Install the plugin using `npm install strapi-auto-nanoid`
2. Create a new Strapi model with the custom type `autoNanoID`, like this:

```javascript
module.exports = {
  attributes: {
    title: {
      type: 'string',
      required: true,
    },
    uid: {
      type: "customField",
      customField: "plugin::field-nanoid.nanoid"
    },
  },
};
```

3. When you create a new record in this model via the Strapi API or GraphQL, the plugin will automatically generate a unique NanoID for the `uid` field.

That's it! With the Strapi Auto NanoID Plugin, you can easily add NanoID to your Strapi content without having to worry about generating them yourself.

## License
This plugin is licensed under the MIT License. See the LICENSE file for more information.

This plugin is a fork of `strapi-auto-uuid` based on the work by Cringe Studio: https://github.com/Cringe-Studio/strapi-auto-uuid
