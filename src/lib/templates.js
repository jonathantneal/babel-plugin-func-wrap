export const templateCjsDefault = `module.exports = function (%%args%%) { %%body%% }`;
export const templateCjsNamed = `exports.%%name%% = function (%%args%%) { %%body%% }`;
export const templateEsmDefault = `export default function (%%args%%) { %%body%% }`;
export const templateEsmNamed = `export function %%name%% (%%args%%) { %%body%% }`;
export const templateGlobalDefault = `%%body%%`;
export const templateGlobalNamed = `%%name%% = function (%%args%%) { %%body%% }`;
export const templateIifeDefault = `(function (%%args%%) { %%body%% })(%%args%%)`;
export const templateIifeNamed = `%%name%% = function (%%args%%) { %%body%% }(%%args%%)`;
