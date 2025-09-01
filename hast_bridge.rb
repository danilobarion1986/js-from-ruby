require 'open3'
require 'json'

class HastBridge
  # Use the Node.js script directly from the `js_functions` directory
  HTML_TO_HAST = "js_functions/html_to_hast.mjs"
  NODE_BIN = ENV.fetch('NODE_BIN', 'node')

  # Convert HTML string to hast object
  # We use a Node.js script to convert an HTML input string to hast object.
  # The script uses the hast-util-from-html library directly.
  #
  # @param input [String] HTML string to convert
  # @return [Hash] hast object
  # @raise [RuntimeError] if the conversion fails
  #
  # @example
  #   Services::HastBridge.html_to_hast("<p>Hello World</p>")
  #     => {"type"=>"root",
  #         "children"=>{
  #           "type"=>"element",
  #           "tagName"=>"div",
  #           "children"=>[
  #             {"type"=>"element",
  #              "tagName"=>"p",
  #              "properties"=>{},
  #              "children"=>[{"type"=>"text", "value"=>"Hello World", "position"=>{"start"=>{"line"=>1, "column"=>4, "offset"=>3}, "end"=>{"line"=>1, "column"=>15, "offset"=>14}}}],
  #              "position"=>{
  #                "start"=>{"line"=>1, "column"=>1, "offset"=>0},
  #                "end"=>{"line"=>1, "column"=>19, "offset"=>18}}}]}}
  def self.html_to_hast(input)
    raise "input must be a string containing HTML" unless input.is_a?(String)

    stdout, stderr, status = Open3.capture3(
      NODE_BIN,
      HTML_TO_HAST.to_s,
      stdin_data: input, binmode: true
    )

    raise "html_to_hast failed (exit #{status.exitstatus}): #{stderr}" unless status.success?
    JSON.parse(stdout)
  end
end
