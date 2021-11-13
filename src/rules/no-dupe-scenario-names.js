import _ from 'lodash';
import * as gherkinUtils from './utils/gherkin';

export const name = 'no-dupe-scenario-names';
export const availableConfigs = [
  'anywhere',
  'in-feature',
  'anywhere-compile',
  'in-feature-compile'
];

let scenarios = {};

export function run({feature, pickles, file}, configuration) {
  if (!feature) {
    return [];
  }

  let errors = [];

  const compile = _.isString(configuration) && configuration && configuration.endsWith('-compile');
  if(_.isString(configuration) && configuration.startsWith('in-feature')) {
    scenarios = {};
  }

  const items = compile ? pickles : feature.children.filter(child => child.scenario).map(child => child.scenario);

  items.forEach(scenario => {
    const scenarioName = scenario.name;
    const scenarioLocation = (compile ? gherkinUtils.getNodeForPickle(feature, scenario) : scenario).location;
    if (Object.prototype.hasOwnProperty.call(scenarios, scenarioName)) {
      const dupes = getFileLinePairsAsStr(scenarios[scenarioName].locations);

      scenarios[scenarioName].locations.push({
        file: file.relativePath,
        line: scenarioLocation.line,
        column: scenarioLocation.column,
      });

      errors.push({
        message: 'Scenario name is already used in: ' + dupes,
        rule: name,
        line: scenarioLocation.line,
        column: scenarioLocation.column,
      });
    } else {
      scenarios[scenarioName] = {
        locations: [
          {
            file: file.relativePath,
            line: scenarioLocation.line,
            column: scenarioLocation.column,
          }
        ]
      };
    }
  });

  return errors;
}

function getFileLinePairsAsStr(objects) {
  let strings = [];
  objects.forEach(object => {
    strings.push(object.file + ':' + object.line);
  });
  return strings.join(', ');
}
