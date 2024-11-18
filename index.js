const core = require('@actions/core');
const github = require('@actions/github');
const { parseFeedUrls, processFeeds } = require('./process');
const fs = require('fs');

async function run() {
  try {
    const feedUrl = core.getInput('feed_url');
    const feedUrlsFile = core.getInput('feed_urls_file');
    const templateFile = core.getInput('template_file');
    const outputDir = core.getInput('output_dir');
    const dateFormat = core.getInput('date_format');

    // Validate input values
    if (!fs.existsSync(templateFile)) {
      core.setFailed(`Template file '${templateFile}' does not exist.`);
      return;
    }

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
      console.log(`Output directory '${outputDir}' created.`);
    }

    // Read the template file
    const template = fs.readFileSync(templateFile, 'utf8');

    const feedUrls = parseFeedUrls(feedUrl, feedUrlsFile);

    if (feedUrls.length === 0) {
      core.setFailed('No valid feed URLs provided.');
      return;
    }

    await processFeeds(feedUrls, template, outputDir, dateFormat);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
