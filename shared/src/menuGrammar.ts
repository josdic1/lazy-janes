import { z } from "zod";

export const OFFERING_KINDS = [
  "preset",
  "retail",
  "service",
] as const;
export const offeringKindSchema = z.enum(OFFERING_KINDS);
export type OfferingKind = z.infer<typeof offeringKindSchema>;

export const UNIVERSAL_COMPONENT_ROLES = [
  "base",
  "primary",
  "carrier",
  "filling",
  "topping",
  "sauce",
  "accompaniment",
] as const;
export const universalComponentRoleSchema =
  z.enum(UNIVERSAL_COMPONENT_ROLES);
export type UniversalComponentRole =
  z.infer<typeof universalComponentRoleSchema>;

export const UNIVERSAL_RELATIONSHIPS = [
  "contains",
  "comes_with",
] as const;
export const universalRelationshipSchema =
  z.enum(UNIVERSAL_RELATIONSHIPS);
export type UniversalRelationship =
  z.infer<typeof universalRelationshipSchema>;

export const CAPABILITY_KINDS = [
  "remove",
  "side",
  "extra",
  "replace",
  "prepare",
  "select",
] as const;
export const capabilityKindSchema = z.enum(CAPABILITY_KINDS);
export type CapabilityKind = z.infer<typeof capabilityKindSchema>;

export const GRAMMAR_NODE_KINDS = [
  "component",
  "choice",
  "variant",
  "bundle",
  "nested_preset",
  "add_catalog",
  "measure",
  "scope",
  "sequence",
] as const;
export const grammarNodeKindSchema = z.enum(GRAMMAR_NODE_KINDS);
export type GrammarNodeKind = z.infer<typeof grammarNodeKindSchema>;

export const COMMERCIAL_POLICY_KINDS = [
  "price",
  "availability",
  "condition",
  "payment",
  "notice",
] as const;
export const commercialPolicyKindSchema =
  z.enum(COMMERCIAL_POLICY_KINDS);
export type CommercialPolicyKind =
  z.infer<typeof commercialPolicyKindSchema>;
