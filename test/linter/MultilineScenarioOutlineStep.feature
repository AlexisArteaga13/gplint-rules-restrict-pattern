Feature: This is a multiline
scenario outline step feature

  Scenario Outline: This is a multiline
scenario outline step scenario

    Given this step is not multiline <foo>
    And this step
     is multiline

  Examples:
  | foo |
  | 1   |
