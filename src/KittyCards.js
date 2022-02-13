import React from 'react';
import { Button, Card, Grid, Message, Modal, Form, Label } from 'semantic-ui-react';

import KittyAvatar from './KittyAvatar';
import { TxButton } from './substrate-lib/components';

// --- About Modal ---

const TransferModal = props => {
  const { kitty, accountPair, setStatus } = props;
  const [open, setOpen] = React.useState(false);
  const [formValue, setFormValue] = React.useState({});

  const formChange = key => (ev, el) => {
    setFormValue({ ...formValue, [key]: el.value });
  };

  const confirmAndClose = (unsub) => {
    setOpen(false);
    if (unsub && typeof unsub === 'function') unsub();
  };

  return <Modal onClose={() => setOpen(false)} onOpen={() => setOpen(true)} open={open}
    trigger={<Button basic color='blue'>Transfer</Button>}>
    <Modal.Header>Kitty Transfer</Modal.Header>
    <Modal.Content><Form>
      <Form.Input fluid label='Kitty ID' readOnly value={kitty.dna} />
      <Form.Input fluid label='Receiver' placeholder='Receiver Address' onChange={formChange('target')} />
    </Form></Modal.Content>
    <Modal.Actions>
      <Button basic color='grey' onClick={() => setOpen(false)}>Cancel</Button>
      <TxButton
        accountPair={accountPair}
        label='Transfer'
        type='SIGNED-TX'
        setStatus={setStatus}
        onClick={confirmAndClose}
        attrs={{
          palletRpc: 'substrateKitties',
          callable: 'transfer',
          inputParams: [formValue.target, kitty.dna],
          paramFields: [true, true]
        }}
      />
    </Modal.Actions>
  </Modal>;
};

// --- Set Price ---

const SetPrice = props => {
  const { kitty, accountPair, setStatus } = props;
  const [open, setOpen] = React.useState(false);
  const [formValue, setFormValue] = React.useState({});

  const formChange = key => (ev, el) => {
    setFormValue({ ...formValue, [key]: el.value });
  };

  const confirmAndClose = (unsub) => {
    setOpen(false);
    if (unsub && typeof unsub === 'function') unsub();
  };

  return <Modal onClose={() => setOpen(false)} onOpen={() => setOpen(true)} open={open}
    trigger={<Button basic color='blue'>Set Price</Button>}>
    <Modal.Header>Set Kitty Price</Modal.Header>
    <Modal.Content><Form>
      <Form.Input fluid label='Kitty ID' readOnly value={kitty.dna} />
      <Form.Input fluid label='Price' placeholder='Enter Price' onChange={formChange('target')} />
    </Form></Modal.Content>
    <Modal.Actions>
      <Button basic color='grey' onClick={() => setOpen(false)}>Cancel</Button>
      <TxButton
        accountPair={accountPair}
        label='Set Price'
        type='SIGNED-TX'
        setStatus={setStatus}
        onClick={confirmAndClose}
        attrs={{
          palletRpc: 'substrateKitties',
          callable: 'setPrice',
          inputParams: [kitty.dna, formValue.target],
          paramFields: [true, true]
        }}
      />
    </Modal.Actions>
  </Modal>;
};

// --- About Kitty Card ---

const KittyCard = props => {
  const { kitty, accountPair, setStatus } = props;
  const { dna = null, owner = null, gender = null, price = null } = kitty;
  const displayDna = dna && dna.toJSON();
  const isSelf = accountPair.address === kitty.owner;

  return <Card>
    {isSelf && <Label as='a' floating color='teal'>Mine</Label>}
    <KittyAvatar dna={dna.toU8a()} />
    <Card.Content>
      <Card.Meta style={{ fontSize: '.9em', overflowWrap: 'break-word' }}>
        DNA: {displayDna}
      </Card.Meta>
      <Card.Description>
        <p style={{ overflowWrap: 'break-word' }}>
          Gender: {gender}
        </p>
        <p style={{ overflowWrap: 'break-word' }}>
          Owner: {owner}
        </p>
        <p style={{ overflowWrap: 'break-word' }}>
          Price: {price || 'Not For Sale'}
        </p>
      </Card.Description>
    </Card.Content>
    <Card.Content extra style={{ textAlign: 'center' }}>{owner === accountPair.address
      ? <>
        <SetPrice kitty={kitty} accountPair={accountPair} setStatus={setStatus} />
        <TransferModal kitty={kitty} accountPair={accountPair} setStatus={setStatus} />
      </>
      : ''
    }</Card.Content>
  </Card>;
};

const KittyCards = props => {
  const { kitties, accountPair, setStatus } = props;

  if (kitties.length === 0) {
    return <Message info>
      <Message.Header>No Kitty found here... Create one now!&nbsp;
        <span role='img' aria-label='point-down'>👇</span>
      </Message.Header>
    </Message>;
  }

  return <Grid columns={3}>{kitties.map((kitty, i) =>
    <Grid.Column key={`kitty-${i}`}>
      <KittyCard kitty={kitty} accountPair={accountPair} setStatus={setStatus} />
    </Grid.Column>
  )}</Grid>;
};

export default KittyCards;