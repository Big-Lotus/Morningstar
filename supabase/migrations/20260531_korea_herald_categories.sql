update public.articles
set category = case category
  when 'Culture' then 'Life&Culture'
  when 'Tech' then 'Business'
  when 'Economy' then 'Business'
  when 'Global' then 'World'
  when 'Science' then 'National'
  when 'Society' then 'National'
  else category
end
where category in ('Culture', 'Tech', 'Economy', 'Global', 'Science', 'Society');

update public.custom_sources
set category = case category
  when 'Culture' then 'Life&Culture'
  when 'Tech' then 'Business'
  when 'Economy' then 'Business'
  when 'Global' then 'National'
  when 'Science' then 'National'
  when 'Society' then 'National'
  else category
end
where category in ('Culture', 'Tech', 'Economy', 'Global', 'Science', 'Society');

insert into public.user_interests (user_id, category)
select distinct
  user_id,
  case category
    when 'Culture' then 'Life&Culture'
    when 'Tech' then 'Business'
    when 'Economy' then 'Business'
    when 'Global' then 'World'
    when 'Science' then 'National'
    when 'Society' then 'National'
    else category
  end as category
from public.user_interests
where category in ('Culture', 'Tech', 'Economy', 'Global', 'Science', 'Society')
on conflict (user_id, category) do nothing;

delete from public.user_interests
where category in ('Culture', 'Tech', 'Economy', 'Global', 'Science', 'Society');

alter table public.custom_sources
  alter column category set default 'National';
