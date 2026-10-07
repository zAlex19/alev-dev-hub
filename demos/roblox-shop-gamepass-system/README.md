# Roblox Shop & Game Pass System

A functional Roblox shop/monetization demo showing UI implementation, system integration, and the native Roblox Game Pass purchase flow.

## Demo

**Video:** https://streamable.com/tdxb2m

The recording shows the flow in Roblox Studio using Roblox's official test-purchase prompt.

## What this demonstrates

- Functional in-game shop UI and navigation
- Game Pass integration through `MarketplaceService`
- Roblox's native purchase prompt rather than a custom mock checkout
- Ownership state updating after purchase
- UI changing from price to `OWNED`
- Repeat ownership verification through the Roblox prompt
- Integration with an existing clicker/gameplay system
- Studio QA flow without charging real Robux

## Implementation notes

The shop is wired to gameplay/monetization state rather than being a visual-only mockup. Purchase completion is handled through Roblox's purchase-finished event, with ownership reflected back into the UI.

For Studio QA, test ownership is kept session-scoped so the purchase flow can be tested repeatedly without writing fake ownership into production data.

## Scope shown

This demo is intended as a compact portfolio sample for:

- Roblox / Luau scripting
- UI implementation
- Monetization
- Client/server integration
- Functional testing and QA

The repository does not include private client code or proprietary assets.
