/**
 * In the JavaScript file, you have a program that performs a GET request on the
 * route https://coderbyte.com/api/challenges/json/wizard-list and then sort the object keys alphabetically.
 * 
 * However, the sorting should be case-insensitive,
 * and the original data structure should be preserved (e.g., arrays should remain arrays, objects should remain objects).
 *
 * Next, remove any duplicate objects from arrays.
 * Two objects are considered duplicates if they have the same keys and values in the same order.
 * Only the first occurrence should be preserved when an array contains duplicate objects.
 *
 * Finally, remove any object properties with all values set to an empty string, null, or undefined, and console log an array of the modified objects as a string.
 */

https.get('https://coderbyte.com/api/challenges/json/wizard-list', (resp) => {
  const dataChunks = [];

  resp.on('data', chunk => {
    const result = chunk.toString();

    dataChunks.push(result);
  });

  resp.on('end', () => {
    const data = dataChunks.join('');

    const parsedData = JSON.parse(data);

    const sortObjectKeys = o => {
      const keys = Object.keys(o).sort((a, b) => 
        a.localeCompare(b, undefined, { sensitivity: "base" })
      );

      return Object.fromEntries(keys.reduce((sortedObject, key) => {
        if (o[key] && Array.isArray(o[key])) {
          sortedObject.set(key, o[key].map(sortObjectKeys));

          return sortedObject;
        }

        if (o[key] && typeof o[key] === typeof Object.create(null)) {
          sortedObject.set(key, sortObjectKeys(o[key]));

          return sortedObject;
        }

        sortedObject.set(key, o[key]);

        return sortedObject;
      }, new Map()));
    }

    // can just compare strings
    const removeDuplicateObjects = arr => {
      const deduped = [];
      const present = new Set();

      const calculateMd5 = o =>
        crypto.createHash('md5').update(JSON.stringify(o)).digest('hex');

      arr.forEach(o => {
        const md5 = calculateMd5(o);

        if (!present.has(md5)) {
          deduped.push(o);
          present.add(md5);
        }
      });

      return deduped;
    }

    const removeFalsyProperties = o => {
      const falsyPropertiesRemoved = { ...o };

      Object.entries(falsyPropertiesRemoved).forEach(([key, value]) => {
        if (falsyPropertiesRemoved[key] && Array.isArray(falsyPropertiesRemoved[key])) {
          const removed = falsyPropertiesRemoved[key].map(removeFalsyProperties);

          falsyPropertiesRemoved[key] = removed;
        }

        if (falsyPropertiesRemoved[key] && 
          !Array.isArray(falsyPropertiesRemoved[key]) &&
          falsyPropertiesRemoved[key] === typeof Object.create(null))
          removeFalsyProperties(falsyPropertiesRemoved[key]);

        if (!value) delete falsyPropertiesRemoved[key];
      });

      return falsyPropertiesRemoved;
    }

    console.log(JSON.stringify(removeDuplicateObjects(parsedData.map(removeFalsyProperties).map(sortObjectKeys)), null, 2));
  });
});

