#!/bin/bash

# Set the directory path
DIRECTORY="."

# Output file path for the sitemap
SITEMAP_FILE="sitemap.xml"

# Main site lin
SITE_LOCATION="https://app.scribbler.live"

# Create the XML sitemap header
echo '<?xml version="1.0" encoding="UTF-8"?>' > "$SITEMAP_FILE"
echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' >> "$SITEMAP_FILE"


README_MODIFIED=$(stat -f %m README.md)
echo '  <url>' >> "$SITEMAP_FILE"
echo "    <loc>$SITE_LOCATION/examples/README</loc>" >> "$SITEMAP_FILE"
echo "    <lastmod>$(date -r $README_MODIFIED +'%Y-%m-%dT%H:%M:%SZ')</lastmod>" >> "$SITEMAP_FILE"
echo '  </url>' >> "$SITEMAP_FILE"


# Find all files in the directory and generate sitemap entries
find "$DIRECTORY"/*.jsnb -type f | while read -r FILE
do
  FILENAME=$(basename "$FILE")
  FILENAME_ESCAPED=$(echo "$FILENAME" | sed 's/\&/\&amp;/g; s/</\&lt;/g; s/>/\&gt;/g; s/"/\&quot;/g; s/'\''/\&apos;/g')
  FILE_MODIFIED=$(stat -f %m "$FILE")
  
  echo '  <url>' >> "$SITEMAP_FILE"
  echo "    <loc>$SITE_LOCATION/?jsnb=./examples/$FILENAME_ESCAPED</loc>" >> "$SITEMAP_FILE"
  echo "    <lastmod>$(date -r $FILE_MODIFIED +'%Y-%m-%dT%H:%M:%SZ')</lastmod>" >> "$SITEMAP_FILE"
  echo '  </url>' >> "$SITEMAP_FILE"
done

# Close the XML sitemap
echo '</urlset>' >> "$SITEMAP_FILE"

echo "Sitemap generated at: $SITEMAP_FILE"
