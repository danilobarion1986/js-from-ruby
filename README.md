# JS from Ruby

This project provides a Ruby bridge to Node.js functions.
It allows you to leverage Node.js libraries from within Ruby applications.

## What it does

The `HastBridge` class provides a Ruby interface to Node.js functions that convert HTML strings to HAST objects. This is useful when you need to parse HTML and work with its abstract syntax tree representation in Ruby.

You can use any available Node.js library from within Ruby.

## Prerequisites

- Ruby 3.3.0 or higher
- Node.js 20.0.0 or higher
- npm (comes with Node.js)

## Setup

1. Install Ruby dependencies:
   ```bash
   gem install bundler
   bundle install
   ```

2. Install Node.js dependencies:
   ```bash
   cd js_functions
   npm install
   cd ..
   ```

## Testing

To run the test suite, use RSpec:

```bash
bundle exec rspec hast_bridge_spec.rb
```

## How it works

The `HastBridge.html_to_hast` method:
1. Takes an HTML string as input
2. Calls a Node.js script (`js_functions/html_to_hast.mjs`) via `Open3.capture3`
3. Returns the HAST object as a Ruby hash

## Example usage

```ruby
require './hast_bridge'

# Convert HTML to HAST
html = '<p>Hello World</p>'
hast = HastBridge.html_to_hast(html)

# The result is a Ruby hash representing the HAST structure
puts hast.inspect
```

## Project structure

- `hast_bridge.rb` - Main Ruby class that bridges to Node.js
- `hast_bridge_spec.rb` - RSpec test file
- `js_functions/` - Node.js functions and dependencies
  - `html_to_hast.mjs` - Node.js script that converts HTML to HAST
  - `package.json` - Node.js dependencies
