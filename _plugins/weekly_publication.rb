# Only explicitly approved weekly notes may be rendered or added to the sitemap.
module Fakeswifter
  class WeeklyPublication < Jekyll::Generator
    safe true
    priority :highest
    def generate(site)
      collection = site.collections['weekly']
      return unless collection
      collection.docs.select! do |doc|
        doc.data['published'] == true && doc.date <= site.time
      end
    end
  end
end
