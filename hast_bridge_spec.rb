require './hast_bridge.rb'

RSpec.describe HastBridge do
  describe '#html_to_hast' do
    it 'calls htmlToHast via Node and returns HAST as as hash' do
      input = '<p>Hello</p>'
      hast = described_class.html_to_hast(input)

      expected_hast = {
        "type" => "root",
        "children" => {
          "type" => "element", "tagName" => "div",
          "children" => [
            {
              "type" => "element", "tagName" => "p", "properties" => {}, "children" => [
                {
                  "type" => "text", "value" => "Hello", "position" => { "start" => { "line" => 1, "column" => 4, "offset" => 3 }, "end" => { "line" => 1, "column" => 9, "offset" => 8 } }
                }
              ],
              "position" => { "start" => { "line" => 1, "column" => 1, "offset" => 0 }, "end" => { "line" => 1, "column" => 13, "offset" => 12 } }
            }
          ]
        }
      }

      expect(hast).to eql(expected_hast)
    end
  end
end
