/**
 * @fileoverview Lazy evaluated inputs
 * @see action.yml
 */

import {getInput} from './github_actions_core.js';

/** @type function(): string */
export const fileId = getInput('file-id');
export const airtableApiKey = getInput('airtable-api-key');
export const airtableBaseId = getInput('airtable-base-id');
export const airtableOrgIdsBaseId = getInput('airtable-org-ids-base-id');
export const billComDevKey = getInput('bill-com-dev-key');
export const billComUserName = getInput('bill-com-user-name');
export const billComPassword = getInput('bill-com-password');
export const ecrApproverUserProfileId =
  getInput('ecr-approver-user-profile-id');
