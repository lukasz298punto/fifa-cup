import { Button, ButtonGroup } from '@mui/material';
import { TabPanel } from 'components/TabPanel';
import { groupSymbol } from 'constants/global';
import { map } from 'lodash';
import React, { useState } from 'react';
import { Schema, TournamentSchema } from 'types/global';
import { useTranslation } from 'react-i18next';
import Group from './Group';
import { Control } from 'react-hook-form';

type Props = {
    schema: Schema;
    index: number;
    control: Control<TournamentSchema, any>;
};

function GroupsPhase({ schema, index, control }: Props) {
    const [tab, setTab] = useState('0');

    const { t } = useTranslation();

    const handleClick = (index: string) => {
        setTab(index);
    };

    const phase = schema.phases[index];

    return (
        <>
            <div className="overflow-x-auto">
                <ButtonGroup variant="outlined">
                    {map(phase.groups, (group, index) => (
                        <Button
                            className="whitespace-nowrap"
                            key={index}
                            variant={tab === String(index) ? 'contained' : 'outlined'}
                            size="small"
                            onClick={() => handleClick(String(index))}
                        >
                            {t('Grupa')} {groupSymbol[index]}
                        </Button>
                    ))}
                </ButtonGroup>
            </div>
            {map(phase.groups, (group, i) => (
                <TabPanel key={i} value={tab} index={String(i)}>
                    <Group
                        control={control}
                        typeOfWin={phase.typeOfWin}
                        promotion={group.promotion}
                        index={i}
                        phaseIndex={index}
                    />
                </TabPanel>
            ))}
        </>
    );
}
export default React.memo(GroupsPhase);
