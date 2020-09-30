import React, { useState } from 'react';
import { Container } from '@material-ui/core';
import mock from '../mock';
import EngineerUser from '../models/EngineerUser';
import { Link } from 'react-router-dom';


const range = Array(10).fill(0).map((v, i) => i + 1);
const mockEngineerUsers: EngineerUser[] = range.map<EngineerUser>((i) => {
  const id = mock.getRandomInt(0, 1000);
  return {
    id,
    loginName: `github-user-${id}`,
    displayName: `エンジニア${id}号`,
    photoURL: "https://avatars3.githubusercontent.com/u/51188956?v=4",
  }
});

export default function EngineerUserListPage() {
  const [engineerUsers, setEngineerUsers] = useState<EngineerUser[]>(mockEngineerUsers);

  return (
    <Container>
      <div className="engineer">
        {
          engineerUsers.map((engineerUser) => {
            return (
              <div>
                <Link to={`/engineers/${engineerUser.id}`}>
                  {engineerUser.displayName}さん
                </Link>
              </div>
            );
          })
        }
      </div>
    </Container>
  );
}