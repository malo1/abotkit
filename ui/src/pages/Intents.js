import React, { useState, useEffect } from 'react';
import { notification, Breadcrumb, Collapse, Button, Modal, Input, Select, Tag, Divider } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import { createUseStyles } from 'react-jss';

const { Panel } = Collapse;
const { Option } = Select;

const useStyles = createUseStyles({
  input: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 12
  },
  label: {
    flex: '0 0 16%',
    '&:before': {
      display: 'inline-block',
      marginRight: 4,
      color: '#ff4d4f',
      fontSize: 14,
      fontFamily: 'SimSun, sans-serif',
      lineHeight: 1,
      content: '"*"'
    }
  },
  button: {
    marginLeft: 6
  }
});

const showNotification = (headline, message='', type='warning') => {
  notification[type]({
    message: headline,
    description: message,
  });
};

const Intents = () => {  
  const classes = useStyles()

  const [intents, setIntents] = useState([]);
  const [visible, setVisible] = useState(false);
  const [examples, setExamples] = useState([]);
  const [exampleText, setExampleText] = useState('');
  const [phrases, setPhrases] = useState([]);
  const [phraseText, setPhraseText] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3000/intents').then(response => {
      setIntents(response.data.intents);
    }).catch(error => {
      console.warn('abotkit rest api is not available', error);
    })        
  }, []);

  const removeExample = text => {
    setExamples(examples.filter(example => example !== text));
  }

  const addExample = () => {
    if (exampleText === '') {
      showNotification('Couldn\'t add example', 'The example text should not be empty.');
      return;
    }

    if (examples.includes(exampleText)) {
      showNotification('Couldn\'t add example', 'This example is already included in the example list.');
      return;
    }

    setExamples([...examples, exampleText]);
    setExampleText('');
  }

  const removePhrase = text => {
    setPhrases(phrases.filter(phrase => phrase !== text));
  }

  const addPhrase = () => {
    if (phraseText === '') {
      showNotification('Couldn\'t add phrase', 'The phrase text should not be empty.');
      return;
    }

    if (phrases.includes(phraseText)) {
      showNotification('Couldn\'t add phrase', 'This phrase is already included in the phrase list.');
      return;
    }

    setPhrases([...phrases, phraseText]);
    setPhraseText('');
  }

  return (
    <>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>Intents</Breadcrumb.Item>
      </Breadcrumb>
      <h1>Intents</h1>
      <Button onClick={() => setVisible(true)} type="primary" shape="round" icon={<PlusOutlined />}>Add intent</Button>

      { intents.length > 0 ? <Collapse defaultActiveKey={['1']}>
        { intents.map((key, intent) =>
          <Panel header={ intent.name } key={ key }>
            <p>Examples</p>
          </Panel>
        )}
      </Collapse> : null }
      <Modal
        title="Add intent"
        visible={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
      >
        <div className={classes.input}>
          <span className={classes.label}>Name:</span><Input placeholder="intent name" />
        </div>
        <div className={classes.input}>
          <span className={classes.label}>Example:</span><Input value={exampleText} onChange={({ target: { value } }) => setExampleText(value)} placeholder="example text to trigger this intent" />
          <Button className={classes.button} onClick={addExample} type="primary" shape="circle" icon={<PlusOutlined />} />
        </div>
        <div>
          { examples.map((example, index) => <Tag key={index} closable onClose={() => removeExample(example)}>{ example }</Tag>) }
        </div>
        <Divider orientation="left">Action</Divider>
        <Select defaultValue="talk" style={{ marginBottom: 12 }}>
          <Option value="talk">Talk</Option>
        </Select>
        <div className={classes.input}>
          <span className={classes.label}>Answer:</span><Input value={phraseText} onChange={({ target: { value } }) => setPhraseText(value)} placeholder="A simple text answer" />
          <Button className={classes.button} onClick={addPhrase} type="primary" shape="circle" icon={<PlusOutlined />} />
        </div>
        <div>
          { phrases.map((phrase, index) => <Tag key={index} closable onClose={() => removePhrase(phrase)}>{ phrase }</Tag>) }
        </div>
      </Modal>
    </>
  );
}

export default Intents;