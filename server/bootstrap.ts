"use strict";

import type { Strapi } from "@strapi/strapi";
import {nanoid} from "nanoid";

export default ({ strapi }: { strapi: Strapi }) => {
  const { contentTypes } = strapi
  const models = Object.keys(contentTypes).reduce((acc, key) => {
    const contentType = contentTypes[key]
    if(!key.startsWith('api')) return acc

    const attributes = Object.keys(contentType.attributes).filter((attrKey) => {
      const attribute = contentType.attributes[attrKey]

      if(attribute.customField === 'plugin::field-nanoid.nanoid') {
        return true
      }
    })

    if(attributes.length > 0) {
      return { ...acc, [key]: attributes.map((attrKey) => {
          return {
            key: attrKey,
            options: contentType.attributes[attrKey]
          }
        }) }
    }

    return acc
  }, {}) as { [key: string]: Array<{ key: string, options: { options: { idLength: number | null } } }> }

  const modelsToSubscribe = Object.keys(models)

  const validate = (proposedId, length) => {
    return new RegExp(`/[\\w_-]{${length}}/`).test(proposedId)
  }

  strapi.db.lifecycles.subscribe((event) => {
    if (event.action === 'beforeCreate' && modelsToSubscribe.includes(event.model.uid)) {
      models[event.model.uid].forEach(({ key, options }) => {
        const idLength = options?.options?.idLength ?? 21;
        const validationRegExp = new RegExp("^[\\w_-]{" + idLength + "}$");
        const validate = (proposedId) => {
          return validationRegExp.test(proposedId)
        }
        console.log(key, options);
        if(!event.params.data[key] || !validate(event.params.data[key])) {
          event.params.data[key] = nanoid(idLength)
        }
      })
    }
  });
};
