# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.5.0] - 2026-08-30

### Added

- CSRF protection via synchronizer token pattern (`csrf-sync`), covering all mutating routes
- Portfolio focused README overhaul with feature breakdowns and architecture decisions
- meta description tag for search indexing

## [0.4.0] - 2026-08-20

### Added

- Loading skeletons for mission, squad and evaluation pages
- PWA manifest and required icons
- Social sharing meta tags (Open Graph and Twitter Card)

### Fixed

- Favicon MIME type mismatch
- Desktop layout spacing cleanup

## [0.3.0] - 2026-08-14

### Added

- Full mobile responsive pass across mission, squad, and evaluation pages
- Keyboard accessibility for slider inputs
- Click-outside-to-close behavior for menus
- iOS-specific fix for background scroll during modals

### Fixed

- Mobile input sizing (prevents unwanted Safari zoom)
- Spacing and layout issues on mobile across mission control, squad, and eval pages

## [0.2.0] - 2026-08-07

### Added

- Reusable input components
- Accessibility pass: tap target sizing, color contrast, focus handling, image/SVG alt text audit
- Modal refactor for evaluation and logout flows

## [0.1.1] - 2026-07-15

### Added

- This changelog
- Walkthrough context and pop ups
- Fixed bug in add mission button validation (not checking correct conditions)
