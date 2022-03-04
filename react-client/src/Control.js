import React from 'react';
import {useEffect, useState} from 'react';
import {v4 as uuidv4} from 'uuid';

const Control = props => {
  const [loading, setLoading] = useState(true);
  const [patterns, setPatterns] = useState([]);

  useEffect(() => {
    const fetchPatterns = async() => {
      async function fetchResource (resource) {
        const res = await fetch(`/resource/${resource}`);
        return await res.json();
      }

      setPatterns(await fetchResource('patterns'))
    }
    fetchPatterns();
    setLoading(false);
  }, [])

  const sendCmd = async (type, name) => {
    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        target_keyword: 'led_fix_',
        command: {
          type,
          name,
          args: {},
        },
        value: 1
      })
    }
    await fetch('/control', requestOptions);
    console.log(`cmd ${type}:${name} sent with body ${requestOptions.body}`);
  }

  async function handlePatternButton(e) {
    e.preventDefault();
    await sendCmd("pattern", e.target.id);
  }

  const patternButtons = patterns.map(patternName => {
    return(<button id={patternName} key={uuidv4()} onClick={handlePatternButton}>{patternName}</button>);
  })

  return (
    <div>
      <h1>Control</h1>
      {loading ?
        <h2>Loading....</h2> :
        <form>
          {patternButtons}
        </form>
      }
    </div>
  )
}

export default Control;
