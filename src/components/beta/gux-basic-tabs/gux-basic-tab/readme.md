# gux-tab



<!-- Auto Generated Below -->


## Properties

| Property      | Attribute       | Description                                                                                         | Type      | Default     |
| ------------- | --------------- | --------------------------------------------------------------------------------------------------- | --------- | ----------- |
| `active`      | `active`        | indicates whether or not the tab is active                                                          | `boolean` | `false`     |
| `tabIconName` | `tab-icon-name` | indicates the gux-icon to display on the left side of the tab (similar to a favicon in the browser) | `string`  | `undefined` |
| `tabId`       | `tab-id`        |                                                                                                     | `string`  | `undefined` |
| `tooltip`     | `tooltip`       |                                                                                                     | `string`  | `''`        |


## Events

| Event               | Description | Type                |
| ------------------- | ----------- | ------------------- |
| `internaltabactive` |             | `CustomEvent<void>` |


## Dependencies

### Depends on

- [gux-tooltip-title](../../gux-tooltip-title)

### Graph
```mermaid
graph TD;
  gux-basic-tab --> gux-tooltip-title
  gux-tooltip-title --> gux-tooltip
  style gux-basic-tab fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
