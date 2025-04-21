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

// src/use-cases/create-conversion.ts
var create_conversion_exports = {};
__export(create_conversion_exports, {
  CreateConversionUseCase: () => CreateConversionUseCase
});
module.exports = __toCommonJS(create_conversion_exports);

// src/use-cases/errors/id-already-exists.ts
var IdAlreadyExists = class extends Error {
  constructor() {
    super("id already exists");
  }
};

// src/use-cases/create-conversion.ts
var CreateConversionUseCase = class {
  constructor(conversionRepository) {
    this.conversionRepository = conversionRepository;
  }
  async execute({
    id,
    origin,
    response_status_id
  }) {
    const ev = await this.conversionRepository.findById(id);
    console.log(ev);
    if (ev) {
      throw new IdAlreadyExists();
    }
    const event = await this.conversionRepository.create({
      id,
      origin,
      response_status_id
    });
    return { event };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CreateConversionUseCase
});
//# sourceMappingURL=create-conversion.js.map