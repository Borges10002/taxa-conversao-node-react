"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/use-cases/search-conversion.ts
var search_conversion_exports = {};
__export(search_conversion_exports, {
  SearchConversionUseCase: () => SearchConversionUseCase
});
module.exports = __toCommonJS(search_conversion_exports);
var SearchConversionUseCase = class {
  constructor(conversionRepository) {
    this.conversionRepository = conversionRepository;
  }
  async execute(params) {
    const result = await this.conversionRepository.getConversionRateOverTime(params);
    const conversion = result.map((row) => ({
      channel: row.channel,
      date: row.date,
      total_sent: Number(row.total_sent),
      total_viewed: Number(row.total_viewed),
      conversion_rate: Number(row.conversion_rate)
    }));
    return {
      conversion
    };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SearchConversionUseCase
});
//# sourceMappingURL=search-conversion.js.map