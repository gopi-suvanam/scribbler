#!/bin/bash

# Set the directory path
DIRECTORY="examples"

# Output file path for the sitemap
SITEMAP_FILE="sitemap.xml"

# Create the XML sitemap header
echo '<?xml version="1.0" encoding="UTF-8"?>' > "$SITEMAP_FILE"
echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' >> "$SITEMAP_FILE"
echo '  <url>' >> "$SITEMAP_FILE"
echo "    <loc>https://decentralized-intelligence.com/jsnb</loc>" >> "$SITEMAP_FILE"
echo "    <lastmod>2023-04-28T00:00:00+00:00</lastmod>" >> "$SITEMAP_FILE"
echo '  </url>' >> "$SITEMAP_FILE"
   
echo '  <url>' >> "$SITEMAP_FILE"
echo "    <loc>https://decentralized-intelligence.com/jsnb/examples/README</loc>" >> "$SITEMAP_FILE"
echo "    <lastmod>$(date +'%Y-%m-%dT%H:%M:%SZ')</lastmod>" >> "$SITEMAP_FILE"
echo '  </url>' >> "$SITEMAP_FILE"

# Find all files in the directory and generate sitemap entries
find "$DIRECTORY"/*.jsnb -type f | while read -r FILE
do
  FILENAME=$(basename "$FILE")
  FILENAME_ESCAPED=$(echo "$FILENAME" | sed 's/\&/\&amp;/g; s/</\&lt;/g; s/>/\&gt;/g; s/"/\&quot;/g; s/'\''/\&apos;/g')
  FILE_MODIFIED=$(stat -f %m "$FILE")
  
  echo '  <url>' >> "$SITEMAP_FILE"
  echo "    <loc>https://decentralized-intelligence.com/jsnb/#./examples/$FILENAME_ESCAPED</loc>" >> "$SITEMAP_FILE"
  echo "    <lastmod>$(date -r $FILE_MODIFIED +'%Y-%m-%dT%H:%M:%SZ')</lastmod>" >> "$SITEMAP_FILE"
  echo '  </url>' >> "$SITEMAP_FILE"
done

# Close the XML sitemap
echo '</urlset>' >> "$SITEMAP_FILE"

echo "Sitemap generated at: $SITEMAP_FILE"
