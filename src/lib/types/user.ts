/**
 * The signed-in user.
 *
 * Previously `User` from `@junobuild/core`, which was the `#user` document the
 * satellite kept per principal. Nothing in this app read that document's
 * fields, so the local shape is deliberately just the identity, resolved from
 * the delegation rather than fetched from the canister.
 */
export interface User {
	key: string;
	owner: string;
}

export type UserOption = User | undefined | null;
