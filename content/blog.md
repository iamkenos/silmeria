---
title: What's new, Postman?
date: 2026-09-13
tags: api, automation, pragmatism
---
It's been a long while since I last used Postman for testing API endpoints. Features that used to be free are now hidden behind a paywall so it kinda just stayed at the bottom of the toolbox and moved on. Until recently, when I was assigned to assess how it would fare for a team's API testing needs as part of consulting work. The catch: our users would be test analysts with minimal automation exposure and a strong aversion to high-code solutions. Given my experience with Postman, I approached the task with some skepticism.

After some evaluation, I found that Postman's [Newman](https://github.com/postmanlabs/newman) collection runner can be a genuinely decent solution for specific use cases. It excels when you need to empower non-technical testers, move fast without heavy-lift automation frameworks, and integrate testing into CI/CD pipelines without requiring dedicated automation engineers.

**On Scalability, Future-Proofing, and Developer Experience**

I have a fair bit of concern about growth: what happens when tests become complex, teams expand, or requirements evolve beyond Postman's capabilities? The honest answer is that Postman has limits, specially as a proper IDE. However, what makes it pragmatic is that these limits emerge gradually, not as a surprise. If your test suite outgrows Postman's scripting capabilities or you need to migrate to a more sophisticated framework down the line, you're not starting from scratch—you have a well-documented collection that serves as both specification and baseline. For teams just starting their testing journey, Postman gets you moving while leaving room to graduate to more specialized tools when the appetite for future-proofing genuinely justifies the investment.

The appeal isn't sophistication; it's pragmatism. Sometimes the best tool isn't the most complex one, it's the one that solves your actual problem while meeting your team where they are.
+++
---
title: Happy E, Happy Me: Replatforming E's Blog
date: 2026-08-19
tags: sidequests, react, strapi
---
The Missus has been blogging on WordPress for years, and it was finally time to give it a makeover.
The goal was simple: Keep every existing post and image intact, but end up with a design that reflected her as a writer.

I had worked with content management systems before and I was keen to explore one of the modern UI libraries in the wild so we got to work after some ideation and brainstorming.

The stack I chose was a React front-end paired with a self-hosted headless Strapi instance for content. The first commit was around mid 2024 and I was hoping to get the site up and running before her birthday in October.

We both enjoyed imagining new components to add and bringing them to life. After nearly three months, the site was live at [dandelionwishing.com](https://www.dandelionwishing.com).

She ended up proofreading and manually migrating each post because silly old me didn't consider content migration as part
of the replatform `:E`. But hey, chalk it up to experience eh? 

It was one thing doing it with a team on a professional setting, but it was another thing provisioning and setting up
everything with just myself and a cheerleader. I learned a lot during this side quest but the most rewarding part was seeing how much she loves using and looking at the new site.
+++
---
title: Closing the Till: What Running and Automating a Chips Franchise Has Taught Me
date: 2026-08-20
tags: business, process, automation
---
When my mates and I thought of running a chips franchise, we thought it was just a matter of buying stock and selling flavoured fries. We soon discovered the challenges of daily operations, and as a software professional who despised repetitive admin tasks such as accounting, inventory management, payroll, and the like, turning back office overhead into code was a no-brainer.

After a couple of years in operation, we made the decision to sell the franchise to cut losses and prepare for new chapters. While closing a business is always a learning experience,
looking at the journey through an engineering lens has given me better insights into how software interacts with real-world operations.

**Automating the Back Office**

To eliminate manual data entry, shift-reporting fatigue, and inconsistent expense logs, I built [triple-taste-rpa](https://github.com/iamkenos/triple-taste-rpa): a collection of small,
automated business processes powered by Google Apps Script and various Node.js tooling.

The goal was to abstract operational complexity away from the service crew and ourselves, and streamline inventory tracking, shift reporting, and sales reconciliation in the background.

**Key Takeaways**

- **Automation amplifies the underlying process**: Software can't fix a broken operational step. We had to standardize the human workflow before writing code.
- **Build for zero friction**: In a fast-paced retail environment, tools must be invisible. Service crew gives simple inputs that can contain errors, and scripts must handle edge cases gracefully with minimal manual intervention.
- **Code can't fix unit economics**: Tech optimizes efficiency, but it doesn't dictate margin realities, foot traffic, or rising ingredient costs. 

The kiosk is now under new management, facing the very same challenges we encountered. Ultimately, it stands as a reminder that even for a small brick-and-mortar business, software can be a powerful multiplier for clarity even when the physical realities remain the hardest problems to solve.
