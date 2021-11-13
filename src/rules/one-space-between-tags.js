import _ from 'lodash';

export const name = 'one-space-between-tags';

export function run({feature}) {
  if (!feature) {
    return;
  }
  let errors = [];

  testTags(feature, errors);

  feature.children.forEach(child => {
    if (child.scenario) {
      testTags(child.scenario, errors);

      child.scenario.examples.forEach(example => {
        testTags(example, errors);
      });
    }
  });

  return errors;
}

function testTags(node, errors) {
  _(node.tags)
    .groupBy('location.line')
    .sortBy('location.column')
    .forEach(tags => {
      _.range(tags.length - 1)
        .map(i => {
          if (tags[i].location.column + tags[i].name.length < tags[i + 1].location.column - 1) {
            errors.push({
              line: tags[i].location.line,
              column: tags[i].location.column,
              rule: name,
              message: 'There is more than one space between the tags ' +
                        tags[i].name + ' and ' + tags[i + 1].name
            });
          }
        });
    });
}
