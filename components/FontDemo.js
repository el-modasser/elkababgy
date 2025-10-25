import React from 'react';

export default function FontDemo() {
  return (
    <div className="p-8 space-y-8 bg-white rounded-lg shadow-md">
      <div className="space-y-2">
        <h2 className="text-xl font-bold">Nexa Font Examples</h2>
        <p className="font-nexa-light text-lg">This is Nexa Light - Clean and minimal</p>
        <p className="font-nexa text-lg">This is Nexa Regular - Professional and modern</p>
        <p className="font-nexa-bold text-lg">This is Nexa Bold - Strong emphasis</p>
        <p className="font-nexa-heavy text-lg">This is Nexa Heavy - Maximum impact</p>
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-bold">Niramit Font Examples</h2>
        <p className="font-niramit-light text-lg">This is Niramit Light - Elegant and light</p>
        <p className="font-niramit text-lg">This is Niramit Regular - Clear and readable</p>
        <p className="font-niramit-bold text-lg">This is Niramit Bold - Strong and confident</p>
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-bold">Font Combinations</h2>
        <div className="p-4 border border-gray-200 rounded">
          <h3 className="font-nexa-bold text-xl mb-2">Heading in Nexa Bold</h3>
          <p className="font-niramit">Body text in Niramit Regular. This demonstrates how you can combine these fonts for a nice typographic hierarchy. Headings in Nexa provide impact while body text in Niramit offers readability.</p>
        </div>
      </div>

      <div className="mt-8 p-4 bg-gray-100 rounded">
        <p className="text-sm">Note: Nexa is substituted with Poppins from Google Fonts as Nexa is not freely available. For production use, consider purchasing the actual Nexa font family.</p>
      </div>
    </div>
  );
}