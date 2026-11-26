---
title: 3 Projects, 3 Weeks, 3 Fully Exhausted Usage Limits
date: 2026-11-26
tags: agentic development, context engineering, token management, sidequests
---
Something rather amusing has happened since I started embracing agentic development.

Three weeks. Three side projects shipped. Three weekly AI usage limits completely exhausted.

Apparently, my productivity and token consumption have developed a rather intimate relationship.

### Shipping like clockwork

Between living a fully functioning adult life and maintaining an ever-growing backlog of my SO's "fun little projects", the distance between ideation and delivery of such projects can be full of hurdles.

Architectural decisions, boilerplate, implementation, debugging, testing — agentic development has dramatically shortened that cycle.

With OpenAI Codex doing much of the heavy lifting, I'm shipping things at a pace that previously felt unrealistic.

The satisfaction of actually completing projects rather than indefinitely lining them up in a queue is somewhat addictive.

There is, however, a catch.

### Context is king, but the kingdom has a budget

Better context generally leads to better outcomes. Requirements, architectural conventions, reference implementations, solid guardrails and acceptance criteria help an agent understand not just what I want, but why.

Unfortunately, context isn't free.

Every reference, exploratory conversation, iteration and validation cycle contributes to usage. Long-running sessions can accumulate a surprising amount of context.

Three consecutive weeks at 100%. Oops. :P

### Learning to be token-conscious

I'm beginning to treat context management as another engineering discipline.

- Providing relevant context rather than all available context.
- Maintaining concise, reusable project instructions.
- Breaking objectives into focused tasks.
- Starting fresh sessions with meaningful handoffs.
- Knowing when a manual change is more efficient than delegating it.

The objective isn't to consume fewer tokens. It's to get more value out of them.

### A new kind of engineering constraint

Where my side projects were previously limited by time and energy, I'm now learning to work within context windows, usage budgets and the capabilities of my agents.

I'm certainly not complaining. Three shipped projects in three weeks is a trade-off I'd happily make again.

Although, for the first time in my software engineering career, I find myself looking forward to a usage limit resetting. One day more ⏱ ⏱ ⏱.

For now, on to the next, more ambitious idea.
+++
---
title: From Months to a Week: An Agentic Development Journey
date: 2026-11-12
tags: ai agents, agentic development, codex
---
I've always enjoyed building things for the web, but turning an idea into something that actually lives on the internet takes time.

Building [slothologyblog.com](https://slothologyblog.com) gave me an opportunity to challenge my usual ways of working and fully embrace agentic development.

### Same ambition, different approach

A similar personal project I previously built using React + Strapi CMS took me roughly three months. Granted, it was a hobby project squeezed between work and weekends, but getting from ideation to deployment still took **three good months**, with a buttload of learnings along the way.

This time, using Astro + EmDash CMS and an AI-driven, human-in-the-loop workflow, I brought that timeline down to just over a week. _Holy moly._

And doing most of the heavy lifting? OpenAI Codex.

Rather than treating AI as glorified autocomplete, I approached it as an engineering collaborator. I focused on requirements, architectural decisions, user experience and validation while delegating much of the implementation.

It felt less like writing software line by line and more like orchestrating its development.

### What I learned along the way

**Context is key.**
Clear requirements, established conventions and well-defined boundaries significantly influence the quality of an agent's output.

**Engineering fundamentals still matter.**
Architecture, maintainability, security and testability arguably become more important when code is generated at such a pace.

**Human-in-the-loop is not optional.**
Agents can produce convincing solutions that aren't necessarily the right ones. Delegating implementation doesn't mean delegating accountability.

**The bottleneck shifts.**
When implementation becomes faster, the challenge shifts towards decision-making, communicating intent and validating outcomes.

### A different way of being a software engineer

My biggest takeaway isn't simply that AI helps me write software faster. It's changing how I approach software engineering.

Three months to just over a week. Different stacks, different workflows. Hardly a controlled comparison, but a meaningful personal milestone.

It's not about replacing engineering expertise. It's about amplifying it.

I'm still learning, experimenting and figuring out where the boundaries are. But it's an exciting time to be someone who enjoys building things.

Less time wrestling with implementation. More time bringing ideas to life.
+++
---
title: Slowing Down and Coming to a Stop
date: 2026-10-29
tags: reflection, adaptability, decisions, growth
---
I've been reflecting on Matthew McConaughey's _Greenlights_ lately. One idea that resonates with me is how life's red and yellow lights can eventually turn into green ones. What initially feels like a setback can sometimes be exactly what we need to move forward.

Perhaps I've reached one of those yellow lights.

### When experience meets change

Having spent more than a decade in software engineering, I've grown comfortable solving problems, chiselling code by hand and gradually turning ideas into working software.

But the landscape is changing. Fast.

Agentic development is fundamentally challenging how we build software. My most recent role made me realise that relying exclusively on traditional development workflows is becoming economically inefficient and increasingly unsustainable in environments where expectations around speed and delivery are evolving.

Knowing how to write code remains valuable. Knowing how to orchestrate its development is becoming equally important.

I decided to step away from a role I realised I wasn't quite ready for. Not because I lacked the engineering fundamentals, but because I recognised a gap between where I was and where I wanted to be.

### Giving myself room to learn

There's a temptation, especially after years in an industry, to believe that experience should always translate into readiness.

But experience and readiness aren't necessarily the same thing.

Rather than struggling to keep pace while figuring everything out, I decided to slow down and invest in focused learning.

Exploring agentic workflows, building personal projects, experimenting with unfamiliar technologies and challenging old engineering habits.

It's refreshing to build things out of curiosity again, without the pressure of having to demonstrate that I already know the answers.

### Not every stop is a setback

Slowing down doesn't mean abandoning ambition. Sometimes, it's about recalibrating it.

The goal isn't to discard everything I've learned in favour of AI, but to combine that experience with a new way of building software.

Perhaps knowing when to stop, reassess and become a student again is itself a skill worth developing.

For now, I'm embracing the yellow light. And when it turns green, I'd like to be a little better prepared for the road ahead.
+++
---
title: What's new, Postman?
date: 2026-09-13
tags: api, automation, pragmatism
---
It's been a long while since I last used Postman for testing API endpoints. Features that used to be free are now hidden behind a paywall so it kinda just stayed at the bottom of the toolbox and moved on.

Until recently, when I was assigned to assess how it would fare for a team's API testing needs as part of consulting work. The catch: our users would be test analysts with minimal automation exposure and a strong aversion to high-code solutions. Given my experience with Postman, I approached the task with some skepticism.

After some evaluation, I found that Postman's [Newman](https://github.com/postmanlabs/newman) collection runner can be a genuinely decent solution for specific use cases. It excels when you need to empower non-technical testers, move fast without heavy-lift automation frameworks, and integrate testing into CI/CD pipelines without requiring dedicated automation engineers.

**On Scalability, Future-Proofing, and Developer Experience**

I have a fair bit of concern about growth: what happens when tests become complex, teams expand, or requirements evolve beyond Postman's capabilities? The honest answer is that Postman has limits, specially as a proper IDE. However, what makes it pragmatic is that these limits emerge gradually, not as a surprise. If your test suite outgrows Postman's scripting capabilities or you need to migrate to a more sophisticated framework down the line, you're not starting from scratch—you have a well-documented collection that serves as both specification and baseline. For teams just starting their testing journey, Postman gets you moving while leaving room to graduate to more specialized tools when the appetite for future-proofing genuinely justifies the investment.

The appeal isn't sophistication; it's pragmatism. Sometimes the best tool isn't the most complex one, it's the one that solves your actual problem while meeting your team where they are.
+++
---
title: Closing the Till: What Running and Automating a Chips Franchise Has Taught Me
date: 2026-08-20
tags: business, process, automation
---
When my mates and I thought of running a chips franchise, we thought it was just a matter of buying stock and selling flavoured fries. 

We soon discovered the challenges of daily operations, and as a software professional who despised repetitive admin tasks such as accounting, inventory management, payroll, and the like, turning back office overhead into code was a no-brainer.

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
+++
---
title: Happy E, Happy Me: Replatforming the Missus' Blog
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