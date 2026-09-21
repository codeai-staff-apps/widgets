import Button from '@code-dot-org/component-library/button';
import Typography from '@code-dot-org/component-library/typography';
import {useState} from 'react';

import LanDiagram, {type CardAction, type LinkState} from './LanDiagram';
import {sameSubnet, SCRIPT, type LeaseMap} from './network';
import {Screen, useAnnounce, useScreenMachine} from './shared';

const SCREENS = [
  'intro',
  'connect-laptop',
  'connect-phone',
  'split',
  'fix',
  'resolved',
  'gotcha',
  'summary',
] as const;

const TITLES: Record<string, string> = {
  intro: 'Two DHCP servers on one network',
  'connect-laptop': 'The laptop joins',
  'connect-phone': 'The phone joins',
  split: 'Same wire, different networks',
  fix: 'The fix: one DHCP server',
  resolved: 'Everyone on one network',
  gotcha: 'One more gotcha: reaching Router B',
  summary: 'Recap',
};

function Body({children}: {children: React.ReactNode}) {
  return (
    <Typography semanticTag="p" visualAppearance="body-two">
      {children}
    </Typography>
  );
}

export default function App() {
  const announce = useAnnounce();
  const [leases, setLeases] = useState<LeaseMap>({});
  const [routerBDhcpOn, setRouterBDhcpOn] = useState(true);
  const [answerShown, setAnswerShown] = useState(false);

  const machine = useScreenMachine(SCREENS, {
    onEnter: id => announce(`Step ${SCREENS.indexOf(id as never) + 1} of ${SCREENS.length}: ${TITLES[id]}`),
  });

  // The diagram's verdict is derived, never asserted: the split/connected line
  // only shows once both devices hold leases, and which one shows comes from
  // comparing their actual subnets.
  const link: LinkState =
    machine.is('intro') || machine.is('connect-laptop')
      ? 'idle'
      : leases.laptop && leases.phone
        ? sameSubnet(leases.laptop, leases.phone)
          ? 'connected'
          : 'split'
        : 'idle';

  // A card gets a button only during the step that expects its click, so the
  // learner can never act out of turn. The button stays mounted for the whole
  // step (it merely stops flashing once used) so keyboard focus is never
  // dropped, and every handler is a no-op if its effect already happened.
  const deviceActions: Partial<Record<'laptop' | 'phone', CardAction>> = {};
  let routerBAction: CardAction | undefined;

  if (machine.is('connect-laptop')) {
    deviceActions.laptop = {
      label: 'Send DHCPDISCOVER',
      ariaLabel: "Send the laptop's DHCPDISCOVER",
      flash: !leases.laptop,
      onClick: () => {
        if (leases.laptop) return;
        setLeases(prev => ({...prev, laptop: SCRIPT.laptopFromA}));
        announce('Router A answered first. The laptop leased 192.168.1.100.');
      },
    };
  }
  if (machine.is('connect-phone')) {
    deviceActions.phone = {
      label: 'Send DHCPDISCOVER',
      ariaLabel: "Send the phone's DHCPDISCOVER",
      flash: !leases.phone,
      onClick: () => {
        if (leases.phone) return;
        setLeases(prev => ({...prev, phone: SCRIPT.phoneFromB}));
        announce('Router B answered first. The phone leased 192.168.0.100, a different subnet.');
      },
    };
  }
  if (machine.is('resolved')) {
    deviceActions.laptop = {
      label: 'Send DHCPDISCOVER',
      ariaLabel: 'Reconnect the laptop by sending its DHCPDISCOVER',
      flash: !leases.laptop,
      onClick: () => {
        if (leases.laptop) return;
        setLeases(prev => ({...prev, laptop: SCRIPT.laptopFromAAgain}));
        announce('The laptop leased 192.168.1.100 from Router A.');
      },
    };
    deviceActions.phone = {
      label: 'Send DHCPDISCOVER',
      ariaLabel: 'Reconnect the phone by sending its DHCPDISCOVER',
      flash: !leases.phone,
      onClick: () => {
        if (leases.phone) return;
        setLeases(prev => ({...prev, phone: SCRIPT.phoneFromA}));
        announce('The phone leased 192.168.1.101 from Router A.');
      },
    };
  }
  if (machine.is('fix')) {
    routerBAction = {
      label: 'Turn off DHCP',
      ariaLabel: "Turn off Router B's DHCP",
      flash: routerBDhcpOn,
      onClick: () => {
        if (!routerBDhcpOn) return;
        setRouterBDhcpOn(false);
        setLeases({});
        announce('Router B DHCP is off. The devices released their leases — reconnect them next.');
      },
    };
  }

  const reset = () => {
    setLeases({});
    setRouterBDhcpOn(true);
    setAnswerShown(false);
    machine.goTo('intro');
  };

  const canAdvance =
    (machine.is('intro') && true) ||
    (machine.is('connect-laptop') && !!leases.laptop) ||
    (machine.is('connect-phone') && !!leases.phone) ||
    machine.is('split') ||
    (machine.is('fix') && !routerBDhcpOn) ||
    (machine.is('resolved') && leases.laptop?.routerId === 'a' && leases.phone?.routerId === 'a') ||
    machine.is('gotcha');

  const isLast = machine.is('summary');

  return (
    <main style={{maxWidth: 720, margin: '0 auto', padding: '2rem 1.25rem', display: 'grid', gap: '1.25rem'}}>
      <LanDiagram
        routerBDhcpOn={routerBDhcpOn}
        leases={leases}
        link={link}
        deviceActions={deviceActions}
        routerBAction={routerBAction}
      />

      <Screen machine={machine} id="intro" headingTag="h1" heading={TITLES.intro}>
        <Body>
          Both routers above are plugged into the same LAN — one wire, one broadcast domain. Each is
          running its own DHCP server, and each hands out addresses on a <em>different</em> subnet. A
          DHCP server leases every device that joins an IP address, a gateway, and a subnet. Let's
          bring two devices online and watch what happens.
        </Body>
      </Screen>

      <Screen machine={machine} id="connect-laptop" headingTag="h1" heading={TITLES['connect-laptop']}>
        <Body>
          When a device joins, it broadcasts a <strong>DHCPDISCOVER</strong> to the whole LAN — "who
          can give me an address?" Every DHCP server hears it, and whichever replies first wins. It's
          a race, and the winner is unpredictable. Press the laptop's flashing{' '}
          <strong>Send DHCPDISCOVER</strong> button.
        </Body>
        {leases.laptop && (
          <Body>
            Router A won the race and leased the laptop <strong>{leases.laptop.ip}</strong>.
          </Body>
        )}
      </Screen>

      <Screen machine={machine} id="connect-phone" headingTag="h1" heading={TITLES['connect-phone']}>
        <Body>
          The phone broadcasts its own DISCOVER. Nothing guarantees the same server answers — this
          time <strong>Router B</strong> replies first. Press the phone's flashing{' '}
          <strong>Send DHCPDISCOVER</strong> button.
        </Body>
        {leases.phone && (
          <Body>
            Router B won this race and leased the phone <strong>{leases.phone.ip}</strong> — a
            different subnet than the laptop.
          </Body>
        )}
      </Screen>

      <Screen machine={machine} id="split" headingTag="h1" heading={TITLES.split}>
        <Body>
          The laptop is on <strong>192.168.1.0/24</strong> and the phone is on{' '}
          <strong>192.168.0.0/24</strong>. To reach each other, each device asks: is the destination
          in my subnet? It isn't — so each hands the packet to <em>its own</em> gateway (192.168.1.1
          vs 192.168.0.1). Those are two different routers that don't know about each other's network,
          so the traffic goes nowhere. Same wire, two separate networks.
        </Body>
      </Screen>

      <Screen machine={machine} id="fix" headingTag="h1" heading={TITLES.fix}>
        <Body>
          A single network should have exactly <strong>one</strong> DHCP server. The extra router can
          stay for its Wi‑Fi and ports, but its DHCP must be turned off — usually called{' '}
          <strong>access-point</strong> or bridge mode. Press the flashing{' '}
          <strong>Turn off DHCP</strong> button on Router B's card.
        </Body>
        {!routerBDhcpOn && (
          <Body>
            Router B is now in access-point mode. The devices dropped their old leases — reconnect
            them on the next step.
          </Body>
        )}
      </Screen>

      <Screen machine={machine} id="resolved" headingTag="h1" heading={TITLES.resolved}>
        <Body>
          With only Router A answering, both devices get addresses from the same pool on the same
          subnet — so they can finally talk. Press each device's flashing{' '}
          <strong>Send DHCPDISCOVER</strong> button to reconnect it.
        </Body>
      </Screen>

      <Screen machine={machine} id="gotcha" headingTag="h1" heading={TITLES.gotcha}>
        <Body>
          The laptop now has <strong>192.168.1.100</strong> from Router A. You open a browser and try
          to load Router B's admin page at <strong>192.168.0.1</strong> to check its settings — but
          the page never loads. Why?
        </Body>
        <Button
          text={answerShown ? 'Hide answer' : 'Reveal answer'}
          type="secondary"
          color="black"
          onClick={() => {
            setAnswerShown(shown => !shown);
            if (!answerShown) {
              announce('Answer revealed.');
            }
          }}
        />
        {answerShown && (
          <div className="callout" role="note">
            <Body>
              Turning off Router B's DHCP didn't <em>move</em> Router B. Its own address is still
              192.168.0.1 on the <strong>192.168.0.0/24</strong> subnet (see its card above). The
              laptop, on 192.168.1.0/24, treats 192.168.0.1 as a different network and hands the
              request to its gateway, 192.168.1.1 — which has no route to 192.168.0.x, so it goes
              nowhere. To manage Router B, give it a LAN address inside the main subnet (e.g.
              192.168.1.2).
            </Body>
          </div>
        )}
      </Screen>

      <Screen machine={machine} id="summary" headingTag="h1" heading={TITLES.summary}>
        <ul style={{margin: 0, paddingLeft: '1.25rem', display: 'grid', gap: '0.5rem'}}>
          <li>
            <Typography semanticTag="span" visualAppearance="body-two" noMargin>
              Two DHCP servers on one LAN race to answer each device — the winner is unpredictable.
            </Typography>
          </li>
          <li>
            <Typography semanticTag="span" visualAppearance="body-two" noMargin>
              If they hand out different subnets, devices split into separate networks that can't
              talk, even on the same wire.
            </Typography>
          </li>
          <li>
            <Typography semanticTag="span" visualAppearance="body-two" noMargin>
              The fix is one authoritative DHCP server: disable DHCP on the extra router
              (access-point mode).
            </Typography>
          </li>
          <li>
            <Typography semanticTag="span" visualAppearance="body-two" noMargin>
              Disabling DHCP doesn't move the router itself — give the access point a LAN address in
              the main subnet, or you won't be able to reach its admin page.
            </Typography>
          </li>
        </ul>
      </Screen>

      <nav style={{display: 'flex', gap: '0.75rem', justifyContent: 'space-between'}} aria-label="Walkthrough navigation">
        <Button
          text="Back"
          type="secondary"
          color="black"
          disabled={machine.is('intro')}
          onClick={machine.back}
        />
        {isLast ? (
          <Button text="Start over" onClick={reset} />
        ) : (
          <Button
            text={machine.is('intro') ? 'Start' : 'Next'}
            disabled={!canAdvance}
            onClick={machine.next}
          />
        )}
      </nav>
    </main>
  );
}
