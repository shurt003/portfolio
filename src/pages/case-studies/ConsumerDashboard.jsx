import CaseStudyLayout from '../../components/CaseStudyLayout'

export default function ConsumerDashboard() {
  return (
    <CaseStudyLayout
      title="Consumer Dashboard"
      subtitle="Motion as a Scalable Product System, turning animation from a one-off enhancement into a tokenized, enterprise-grade interaction layer."
      accent="#7B9EC7"
      tags={['Motion System', 'Enterprise SaaS', 'Q2']}
      overview={[
        { label: 'Role', value: 'Motion & Interaction Design' },
        { label: 'Scope', value: 'Core consumer dashboard, cross-surface interaction patterns' },
        { label: 'Impact', value: '$8.2M enterprise deal - customizable motion cited as a key decision factor' },
      ]}
      sections={[
        {
          label: 'The Problem',
          heading: 'Static states, abrupt transitions, eroding trust',
          body: [
            'The dashboard was built around static loading states and hard page cuts, and in isolation those feel like small details, but during data-heavy interactions, users had no reliable signal about what the system was doing or when it would be done. The product felt slower and less trustworthy than it actually was, not because of any real performance issue, but because there was nothing communicating state.',
            'That distinction mattered. The problem wasn\'t speed, it was legibility. Motion, used deliberately, could solve it.',
          ],
          video: 'https://framerusercontent.com/assets/1YkL8EaT1f8LUKeWqbLRFmY0EU.mp4',
        },
        {
          label: 'Phase 1',
          heading: 'Customizable Interstitial Motion',
          body: 'Interstitials sit at a critical trust boundary - the gap between when a user does something and when the system responds. That moment needed to do real work: communicate that the system had heard the request, that processing was happening, and that the wait was finite. I designed a configurable loader system that let each bank or credit union define their own branded motion experience, so the interstitial felt like part of their product rather than a generic loading screen. The configurability wasn\'t cosmetic, it was what made the system scalable across dozens of different client brands without requiring custom animation work for each one.',
          video: 'https://framerusercontent.com/assets/07m8phpaPk0UbIEocSplh3psaL4.mp4',
        },
        {
          label: 'Phase 2',
          heading: 'Formalizing Motion with Tokens',
          body: [
            'The deeper problem with motion in a product this size is that without a shared system, every animation decision gets made independently, and independently-made decisions compound into inconsistency fast. I introduced motion tokens as shared primitives between design and engineering: duration, easing, keyframe, and usage-intent tokens that created a shared vocabulary and removed the guesswork from every animation decision downstream.',
            'The purpose tokens were the most important part. Rather than just encoding values, they encoded intent: a nav-transition token isn\'t just a duration and easing curve, it\'s a statement about what kind of movement belongs at the navigation level versus a data-load versus an alert entry. That distinction is what keeps the system coherent as it scales.',
          ],
        },
        {
          label: 'Phase 3',
          heading: 'Page-Level Transitions',
          body: "Hard page cuts were replaced with transitions that communicated spatial relationship, so users always had a sense of where they'd come from and where they were going. The timing and easing rules came directly from the token system, which meant the transitions felt consistent with everything else in the product without any additional coordination between teams.",
          video: 'https://framerusercontent.com/assets/BvfPrZe0bTwYX1flaE2tb2wXhvc.mp4',
        },
        {
          label: 'Full System',
          heading: 'Motion system in action',
          video: 'https://framerusercontent.com/assets/vM35FyUNUVxU9ebfTNPPHyO3Rw.mp4',
          impact: '$8.2M enterprise deal - customizable motion cited as a key decision factor. Tokenized motion system adopted across design and engineering as shared reusable primitives.',
        },
        {
          label: 'Reflection',
          heading: 'What I learned',
          body: 'The biggest unlock was realizing that motion decisions, left unstructured, would always be one-offs, each sprint, each feature, each engineer making a slightly different call. Tokenizing motion forced the same discipline we bring to color and spacing: you\'re not picking an animation, you\'re selecting from a system. That shift is what turned this from a single-project enhancement into something that could scale across the entire product.',
        },
      ]}
      nextProject={{ title: 'Secure Messaging Redesign', href: '/messaging-redesign' }}
    />
  )
}
